import React, { useState, useEffect } from 'react';
import {
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Paper,
  Stack,
  TextField,
  Grid,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Add as AddIcon, ArrowBack as ArrowBackIcon, ArrowForward as ArrowForwardIcon, Delete as DeleteIcon } from '@mui/icons-material';

const DocumentUpload = () => {
  const [applicantDialogueopen, setApplicantdialogueOpen] = useState(false);
  const [docDialogueopen, setDocdialogueOpen] = useState(false);
  const [applicantName, setApplicantName] = useState('');
  const [docname, setDocName] = useState('');
  const [file, setFile] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [currentApplicantIndex, setCurrentApplicantIndex] = useState(0);
  const [currentDocIndex, setCurrentDocIndex] = useState(0);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  useEffect(() => {
 
    if (applicants.length > 0 && currentApplicantIndex === 0) {
      setCurrentApplicantIndex(0); 
    }
  }, [applicants, currentApplicantIndex]);

  const handleClickOpen = () => {
    setApplicantdialogueOpen(true);
  };

  const handleClose = () => {
    setApplicantdialogueOpen(false); 
  };

  const handleDocClickOpen = () => {
   setDocdialogueOpen(true);
  };

  const handleDocClose = () => {
   setDocdialogueOpen(false); 
  };

  const handleApplicantNameChange = (event) => {
    setApplicantName(event.target.value);
    setFile('');
  };

  const handleSaveApplicant = () => {
    if (applicantName.trim()) {
      const newApplicant = {
        id: applicants.length + 1,
        name: applicantName,
        documents: [], 
      };
      setApplicants([...applicants, newApplicant]);
      setApplicantName('');
      setApplicantdialogueOpen(false);
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = () => {
   
    const updatedApplicants = [...applicants];
    
    
    const currentApplicant = updatedApplicants[currentApplicantIndex];
    const currentDocument = currentApplicant.documents[currentDocIndex];
  
    
    const updatedDocument = {
      ...currentDocument, 
      file: file, 
    };
  
    
    currentApplicant.documents = [
      ...currentApplicant.documents.slice(0, currentDocIndex),
      updatedDocument, 
      ...currentApplicant.documents.slice(currentDocIndex + 1),
    ];
  
  
    setApplicants(updatedApplicants);
  
    // Clear the file state
    setFile(null);
  };
  

  const handleNext = () => {
    const currentApplicant = applicants[currentApplicantIndex];
    const numDocs = currentApplicant?.documents?.length || 0;
  
    if (numDocs > 0 && currentDocIndex + 1 < numDocs) {
      // Move to the next document of the current applicant
      setCurrentDocIndex(currentDocIndex + 1);
    } else if (currentApplicantIndex + 1 < applicants.length) {
      // Move to the first document of the next applicant
      setCurrentApplicantIndex(currentApplicantIndex + 1);
      setCurrentDocIndex(0);
    }
  };
  const isNextDisabled = () => {
    if (applicants.length === 0) {
      return true;
    }
  
    const currentApplicant = applicants[currentApplicantIndex];
    const numDocs = currentApplicant?.documents?.length || 0;
  
    if (currentApplicantIndex === applicants.length - 1 && currentDocIndex === numDocs - 1) {
      return true; // Disable if on the last document of the last applicant
    }
  
    return false;
  };
  

  const handleBack = () => {
    const currentApplicant = applicants[currentApplicantIndex];
    const numDocs = currentApplicant?.documents?.length || 0;
  
    if (numDocs > 0 && currentDocIndex > 0) {
      // Move to the previous document of the current applicant
      setCurrentDocIndex(currentDocIndex - 1);
    } else if (currentApplicantIndex > 0) {
      // Move to the last document of the previous applicant
      const previousApplicant = applicants[currentApplicantIndex - 1];
      const previousDocIndex = previousApplicant?.documents?.length - 1;
      setCurrentApplicantIndex(currentApplicantIndex - 1);
      setCurrentDocIndex(previousDocIndex);
    }
  };
  
  // Determine if the Back button should be disabled
  const isBackDisabled = () => {
    if (applicants.length === 0) {
      return true;
    }
  
    if (currentApplicantIndex === 0 && currentDocIndex === 0) {
      return true; // Disable if on the first document of the first applicant
    }
  
    return false;
  };
  

  const handleDeleteApplicant = (id) => {
    const updatedApplicants = applicants.filter((applicant) => applicant.id !== id);
    setApplicants(updatedApplicants);
    if (currentApplicantIndex >= updatedApplicants?.length) {
      setCurrentApplicantIndex(updatedApplicants.length - 1);
    }
  };
  const handleDeleteDocs = (docId) => {
    
    const updatedApplicants = applicants.map((applicant, index) => {
     
      if (index === currentApplicantIndex) {
     
        return {
          ...applicant,
          documents: applicant.documents.filter((doc) => doc.id !== docId),
        };
      }
      return applicant; 
    });

    setApplicants(updatedApplicants); 
  };
  

  const handleDocNameChange = (event) => {
    setDocName(event.target.value);
  };

  const handleSaveDocument = () => {
      const randomId = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const newDoc = { name: docname, id: randomId , file:'' };
      const updatedApplicants = [...applicants];
      const currentApplicant = updatedApplicants[currentApplicantIndex];
      currentApplicant?.documents?.push(newDoc);
      setApplicants(updatedApplicants);
    console.log("aaaa");
    setDocName('');
    setDocdialogueOpen(false);
  };

  console.log("appli",applicants[currentApplicantIndex]?.documents[currentDocIndex]?.file?.name);
  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" style={{ padding: 16,marginTop:30 }}>
        <Typography variant="h6">Document Upload</Typography>
        <Button variant="contained" onClick={handleClickOpen}>
          Add Applicant
        </Button>
      </Stack>

      {/* Applicant List */}
      <Grid container spacing={2} style={{ padding: 16 }}>
  {applicants.map((applicant, index) => (
    <Grid
      item
      xs={4}
      sm={8}
      md={2}
      key={applicant.id}
      onClick={() => {
        setCurrentApplicantIndex(index);
        setCurrentDocIndex(0);
      }}
    >
      <Paper
        variant="outlined"
        style={{
          padding: 5,
          backgroundColor: currentApplicantIndex === index ? 'blue' : 'white',
          color: currentApplicantIndex === index ? 'white' : 'black',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <Typography
          variant="h6"
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: 'calc(100% - 24px)',
          }}
        >
          {applicant.name}
        </Typography>
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteApplicant(applicant.id);
          }}
          style={{ padding: 0, color: currentApplicantIndex === index ? 'white' : 'black' }}
        >
          <DeleteIcon style={{ color: 'inherit' }} />
        </IconButton>
      </Paper>
    </Grid>
  ))}
</Grid>


      {/* Documents for selected Applicant */}
      <Box style={{ display: 'flex', flexDirection:isSmallScreen ? 'column':'row', justifyContent: isSmallScreen ? 'center':'space-around', width: '100%', alignItems: 'center' }}>
        <Grid container spacing={2} style={{ padding: 16, display:'flex',justifyContent:'center',alignItems:'center', maxWidth: isSmallScreen ?'100%':'30%'}}>
          {applicants.length > 0 && (
            <Grid item style={{display:'flex',justifyContent:'center',alignItems:'center'}} key={applicants[currentApplicantIndex]?.id}>
              <Paper variant="outlined" style={{ padding: 16 }}>
                <Typography variant="h6">Documents for {applicants[currentApplicantIndex]?.documents[currentDocIndex]?.name}</Typography>

                {/* Display documents for the selected applicant */}
                {applicants[currentApplicantIndex]?.documents?.length > 0 ? (
                  <Box style={{ marginTop: 16 }}>
                    <Typography variant="body1">Uploaded Documents:</Typography>
                    {applicants[currentApplicantIndex]?.documents?.map((doc, index) => (
                      <Grid item  xs={4} key={doc.id} onClick={() => setCurrentDocIndex(index)}>
                        <Paper
                          variant="outlined"
                          style={{
                            padding: 5,
                            backgroundColor: currentDocIndex === index ? '#7c9fd9' : 'white',
                            width:'10vw',
                            marginTop:'10px',
                            marginBottom:'10px',

                            color: currentDocIndex === index ? 'white' : 'black',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            position: 'relative',
                          }}
                        >
                          <Typography
                            variant="h6"
                            style={{
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              maxWidth: 'calc(100% - 24px)',
                            }}
                          >
                            {doc.name}
                          </Typography>
                          <IconButton
                            color="white"
                            onClick={() => handleDeleteDocs(doc.id)}
                            style={{ padding: 0 }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Paper>
                      </Grid>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" style={{ marginTop: 16 }}>
                    No documents uploaded yet.
                  </Typography>
                )}

                {/* Button to add new document */}
                <Button variant="contained" onClick={() => setDocdialogueOpen(true)} component="label" startIcon={<AddIcon />}>
                  Add docs
                </Button>
              </Paper>
            </Grid>
          )}
        </Grid>

          {
            applicants[currentApplicantIndex]?.documents.length > 0 &&  (
        <Stack direction="row" spacing={2} style={{ padding: 16, width:'50%' }}>
          <Paper variant="outlined" style={{ padding: 16, flex: 1 }}>
            <Typography variant="h6">files for {applicants[currentApplicantIndex]?.documents[currentDocIndex]?.name}</Typography>
            {/* Display documents for the selected applicant */}
            {applicants[currentApplicantIndex]?.documents?.length > 0 ? (
              <Box style={{ marginTop: 16 }}>
                <Typography variant="body1">Uploaded Documents:</Typography>
              </Box>
            ) : (
              <Typography variant="body2" style={{ marginTop: 16 }}>
                No files uploaded yet.
              </Typography>
            )}

            {/* File upload */}
            <Button variant="contained" style={{width:isSmallScreen ? '100%':'inherit' , marginTop:isSmallScreen ? 16:0, fontSize:isSmallScreen ? '12px':'inherit'}} component="label" startIcon={<AddIcon />}>
              Choose File
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
            <Button variant="contained" disabled={!file} style={{ marginLeft:isSmallScreen ? 0:16,width:isSmallScreen ? '100%':'inherit', marginTop: isSmallScreen ? 16 : 0, backgroundColor:!file ? 'gray':'blue'}} onClick={handleUpload}>
              Upload
            </Button>
            {/* {file && ( */}
              <Typography variant="body1" style={{ marginTop: 16 }}>
                Selected File: {file?.name || applicants[currentApplicantIndex]?.documents[currentDocIndex]?.file?.name}
              </Typography>
            {/* )} */}
           
          </Paper>
        </Stack>
            )
          }
      </Box>

      {/* Navigation buttons for switching applicants */}
      <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center" style={{ padding: 16 }}>
        <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={handleBack} disabled={isBackDisabled}>
          Back
        </Button>
        <Button variant="contained" endIcon={<ArrowForwardIcon />} onClick={handleNext} disabled={isNextDisabled()}>
          Next
        </Button>
      </Stack>

      {/* Dialog for adding an applicant */}
      <Dialog open={applicantDialogueopen} onClose={handleClose}>
        <DialogTitle>Add Applicant</DialogTitle>
        <DialogContent>
          <TextField
            label="Applicant Name"
            value={applicantName}
            style={{marginTop:6}}
            onChange={handleApplicantNameChange}
            fullWidth
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveApplicant} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for adding document */}
      <Dialog open={docDialogueopen} onClose={handleClose}>
        <DialogTitle>Add Docs</DialogTitle>
        <DialogContent>
          <TextField
            label="Document Name"
            value={docname}
            onChange={handleDocNameChange} 
            style={{marginTop:5}}
            fullWidth
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDocClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveDocument} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DocumentUpload;
