import React, { useState, useEffect, useRef, useCallback } from 'react';import styled from 'styled-components';
import html2canvas from 'html2canvas';

const FeedbackDot = styled.div`
  position: fixed;
  width: 10px;
  height: 10px;
  background-color: #ff4500;
  border-radius: 50%;
  z-index: 9998;
  cursor: pointer;
`;

const PostIt = styled.div`
  position: fixed;
  width: 200px;
  height: 150px;
  background-color: #feff9c;
  border: 1px solid #e6e6e6;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  z-index: 9999;
  display: ${props => props.visible ? 'flex' : 'none'};
  flex-direction: column;
  font-family: 'Comic Sans MS', 'Gilroy', sans-serif;
`;

const FeedbackItem = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding: 10px;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 100%;
  border: none;
  resize: none;
  background-color: transparent;
  font-family: inherit;
  font-size: 14px;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: #666;
  &:hover {
    color: #ff4500;
  }
`;

const Toolbar = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #f0f0f0;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
`;

const Button = styled.button`
  margin: 0 5px;
  padding: 5px 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
  &:hover {
    background-color: #45a049;
  }
`;

const ToolbarInfo = styled.span`
  margin-right: 20px;
  font-size: 14px;
  color: #666;
`;

const FeedbackModeIndicator = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #4CAF50;
  color: white;
  padding: 10px;
  border-radius: 5px;
  z-index: 10001;
  display: ${props => props.visible ? 'block' : 'none'};
`;

const FeedbackModeOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 255, 0, 0.1);
  pointer-events: none;
  z-index: 9997;
  display: ${props => props.visible ? 'block' : 'none'};
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  max-width: 600px;
  background-color: white;
  border: 1px solid #e6e6e6;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 10002;
  padding: 20px;
  display: ${props => props.visible ? 'block' : 'none'};
`;

const ModalHeader = styled.div`
  font-weight: bold;
  margin-bottom: 10px;
`;

const ModalContent = styled.div`
  margin-bottom: 20px;
  white-space: pre-wrap;
  max-height: 400px;
  overflow-y: auto;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
`;

const LoadFeedbackModal = styled(Modal)`
  text-align: center;
`;

const LoadButton = styled(Button)`
  margin: 10px;
  width: 200px;
`;

const FeedbackList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const FeedbackListItem = styled.li`
  padding: 10px;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const FeedbackListItemText = styled.span`
  flex-grow: 1;
  margin-right: 10px;
  cursor: pointer;
`;

const FeedbackListItemDelete = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: #666;
  &:hover {
    color: #ff4500;
  }
`;

const PhotoIcon = styled.span`
  cursor: pointer;
  margin-left: 10px;
  font-size: 20px;
`;

const ScreenshotModal = styled(Modal)`
  width: 90%;
  max-width: 640px;
`;

const ScreenshotImage = styled.img`
  max-width: 100%;
  height: auto;
  object-fit: contain;
`;

const FeedbackComponent = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [isFeedbackMode, setIsFeedbackMode] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
    const [isListModalOpen, setIsListModalOpen] = useState(false);
    const [isScreenshotModalOpen, setIsScreenshotModalOpen] = useState(false);
    const [activeScreenshot, setActiveScreenshot] = useState(null);
    const [activeFeedback, setActiveFeedback] = useState(null);
    const textAreaRef = useRef(null);
  
    useEffect(() => {
      const storedFeedbacks = localStorage.getItem('uiFeedbacks');
      if (storedFeedbacks) {
        setFeedbacks(JSON.parse(storedFeedbacks));
      }
    }, []);
  
    useEffect(() => {
      localStorage.setItem('uiFeedbacks', JSON.stringify(feedbacks));
    }, [feedbacks]);
  
    const captureAndProcessScreenshot = async (x, y) => {
      const feedbackModeIndicator = document.querySelector('.feedback-mode-indicator');
      const feedbackModeOverlay = document.querySelector('.feedback-mode-overlay');
      if (feedbackModeIndicator) feedbackModeIndicator.style.display = 'none';
      if (feedbackModeOverlay) feedbackModeOverlay.style.display = 'none';
  
      const canvas = await html2canvas(document.body);
  
      if (feedbackModeIndicator) feedbackModeIndicator.style.display = '';
      if (feedbackModeOverlay) feedbackModeOverlay.style.display = '';
  
      let scaledCanvas = canvas;
      if (canvas.width > 640) {
        const scaleFactor = 640 / canvas.width;
        scaledCanvas = document.createElement('canvas');
        scaledCanvas.width = 640;
        scaledCanvas.height = canvas.height * scaleFactor;
        const ctx = scaledCanvas.getContext('2d');
        ctx.drawImage(canvas, 0, 0, scaledCanvas.width, scaledCanvas.height);
      }
  
      return scaledCanvas.toDataURL('image/png');
    };
  
    const createFeedbackWithScreenshot = useCallback(async (feedbackId) => {
      const feedback = feedbacks.find(f => f.id === feedbackId);
      if (feedback) {
        const screenshot = await captureAndProcessScreenshot(feedback.x, feedback.y);
        setFeedbacks(prevFeedbacks => 
          prevFeedbacks.map(f => f.id === feedbackId ? {...f, screenshot} : f)
        );
        setActiveFeedback(feedbackId);
      }
    }, [feedbacks]);
  
    useEffect(() => {
      const handleKeyDown = (e) => {
        if (e.altKey) {
          setIsFeedbackMode(true);
        }
      };
  
      const handleKeyUp = (e) => {
        if (!e.altKey) {
          setIsFeedbackMode(false);
        }
      };
  
      const handleClick = async (e) => {
        if (e.altKey) {
          e.preventDefault();
          const newFeedback = {
            id: Date.now(),
            x: e.clientX,
            y: e.clientY,
            text: '',
            createdAt: new Date().toISOString(),
            screenshot: null
          };
          setFeedbacks(prevFeedbacks => [...prevFeedbacks, newFeedback]);
          await createFeedbackWithScreenshot(newFeedback.id);
        }
      };
  
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('keyup', handleKeyUp);
      document.addEventListener('click', handleClick);
  
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('keyup', handleKeyUp);
        document.removeEventListener('click', handleClick);
      };
    }, [createFeedbackWithScreenshot]);

  useEffect(() => {
    if (activeFeedback !== null && textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, [activeFeedback]);

  const handleTextChange = (e, feedbackId) => {
    const updatedFeedbacks = feedbacks.map(f => 
      f.id === feedbackId ? {...f, text: e.target.value} : f
    );
    setFeedbacks(updatedFeedbacks);
  };

  const handleTextAreaBlur = () => {
    setActiveFeedback(null);
  };

  const handleDotClick = (feedbackId) => {
    setActiveFeedback(feedbackId);
  };

  const handleDeleteFeedback = (feedbackId, e) => {
    e.stopPropagation();
    setFeedbacks(prevFeedbacks => prevFeedbacks.filter(f => f.id !== feedbackId));
    if (activeFeedback === feedbackId) {
      setActiveFeedback(null);
    }
  };

  const exportFeedback = () => {
    setIsModalOpen(true);
  };

  const copyToClipboard = (content) => {
    navigator.clipboard.writeText(content).then(() => {
      alert('Copied to clipboard');
    }).catch(err => {
      console.error('Could not copy text: ', err);
    });
  };

  const openNewGist = (content) => {
    const encodedContent = encodeURIComponent(content);
    const gistUrl = `https://gist.github.com/?filename=ui_feedback.json&value=${encodedContent}`;
    window.open(gistUrl, '_blank');
  };

  const loadFeedbackFromData = (data) => {
    try {
      const loadedFeedbacks = JSON.parse(data);
      setFeedbacks(loadedFeedbacks);
      localStorage.setItem('uiFeedbacks', JSON.stringify(loadedFeedbacks));
      alert('Feedback loaded successfully');
      setIsLoadModalOpen(false);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      alert('Failed to load feedback. Please ensure the data is valid JSON.');
    }
  };

  const loadFeedbackFromFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        loadFeedbackFromData(event.target.result);
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const loadFeedbackFromClipboard = async () => {
    try {
      const clipboardData = await navigator.clipboard.readText();
      loadFeedbackFromData(clipboardData);
    } catch (error) {
      console.error('Failed to read clipboard contents:', error);
      alert('Failed to read clipboard contents. Please ensure you have copied the feedback data.');
    }
  };

  const clearFeedback = () => {
    if (window.confirm('Are you sure you want to clear all feedback? This action cannot be undone.')) {
      setFeedbacks([]);
      localStorage.removeItem('uiFeedbacks');
      alert('All feedback has been cleared');
    }
  };

  const showFeedbackList = () => {
    setIsListModalOpen(true);
  };

  const handleListItemClick = (feedbackId) => {
    setActiveFeedback(feedbackId);
    setIsListModalOpen(false);
  };

  const handleScreenshotClick = (screenshot) => {
    setActiveScreenshot(screenshot);
    setIsScreenshotModalOpen(true);
  };

  return (
    <>
      <FeedbackModeIndicator visible={isFeedbackMode} className="feedback-mode-indicator">
        Feedback Mode Active
      </FeedbackModeIndicator>
      <FeedbackModeOverlay visible={isFeedbackMode} className="feedback-mode-overlay" />
      {feedbacks.map(feedback => (
        <React.Fragment key={feedback.id}>
          <FeedbackDot
            style={{ left: `${feedback.x}px`, top: `${feedback.y}px` }}
            onClick={() => handleDotClick(feedback.id)}
          />
          <PostIt
            visible={activeFeedback === feedback.id}
            style={{
              left: `${feedback.x}px`,
              top: `${feedback.y}px`
            }}
          >
            <DeleteButton onClick={(e) => handleDeleteFeedback(feedback.id, e)}>
              🗑️
            </DeleteButton> 
            <FeedbackItem>
              <TextArea
                ref={textAreaRef}
                value={feedback.text}
                onChange={(e) => handleTextChange(e, feedback.id)}
                onBlur={handleTextAreaBlur}
                placeholder="Enter your feedback here..."
              />
            </FeedbackItem>
          </PostIt>
        </React.Fragment>
      ))}
      <Toolbar>
        <ToolbarInfo>Hold Alt/Option + Click to add feedback</ToolbarInfo>
        <Button onClick={exportFeedback}>Export Feedback</Button>
        <Button onClick={() => setIsLoadModalOpen(true)}>Load Feedback</Button>
        <Button onClick={showFeedbackList}>Show Feedback List</Button>
        <Button onClick={clearFeedback} style={{backgroundColor: '#f44336'}}>Clear Feedback</Button>
      </Toolbar>
      <Modal visible={isModalOpen}>
        <CloseButton onClick={() => setIsModalOpen(false)}>×</CloseButton>
        <ModalHeader>Export Feedback</ModalHeader>
        <ModalContent>{JSON.stringify(feedbacks, null, 2)}</ModalContent>
        <Button onClick={() => openNewGist(JSON.stringify(feedbacks, null, 2))}>Open in Gist</Button>
        <Button onClick={() => copyToClipboard(JSON.stringify(feedbacks, null, 2))}>Copy to Clipboard</Button>
        <p>Share this JSON to share your feedback.</p>
      </Modal>
      <LoadFeedbackModal visible={isLoadModalOpen}>
        <CloseButton onClick={() => setIsLoadModalOpen(false)}>×</CloseButton>
        <ModalHeader>Load Feedback</ModalHeader>
        <LoadButton onClick={loadFeedbackFromFile}>Load from File</LoadButton>
        <LoadButton onClick={loadFeedbackFromClipboard}>Load from Clipboard</LoadButton>
      </LoadFeedbackModal>
      <Modal visible={isListModalOpen}>
        <CloseButton onClick={() => setIsListModalOpen(false)}>×</CloseButton>
        <ModalHeader>Feedback List</ModalHeader>
        <ModalContent>
          <FeedbackList>
            {feedbacks.map(feedback => (
              <FeedbackListItem key={feedback.id}>
                <FeedbackListItemText onClick={() => handleListItemClick(feedback.id)}>
                  {feedback.text.slice(0, 50) || "Empty feedback"}
                  {feedback.text.length > 50 ? "..." : ""}
                </FeedbackListItemText>
                <PhotoIcon onClick={() => handleScreenshotClick(feedback.screenshot)}>
                  📷
                </PhotoIcon>
                <FeedbackListItemDelete onClick={(e) => handleDeleteFeedback(feedback.id, e)}>
                  🗑️
                </FeedbackListItemDelete>
              </FeedbackListItem>
            ))}
          </FeedbackList>
        </ModalContent>
      </Modal>
      <ScreenshotModal visible={isScreenshotModalOpen}>
        <CloseButton onClick={() => setIsScreenshotModalOpen(false)}>×</CloseButton>
        <ModalHeader>Screenshot Preview</ModalHeader>
        <ModalContent>
          <ScreenshotImage src={activeScreenshot} alt="Feedback Screenshot" />
        </ModalContent>
      </ScreenshotModal>
    </>
  );
};

export default FeedbackComponent;