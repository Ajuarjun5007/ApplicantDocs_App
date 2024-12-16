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
  
    // Update the documents array with the updated document
    currentApplicant.documents = [
      ...currentApplicant.documents.slice(0, currentDocIndex),
      updatedDocument, // Replace the old document with the updated one
      ...currentApplicant.documents.slice(currentDocIndex + 1),
    ];
  
    // Update the applicants state with the modified applicant
    setApplicants(updatedApplicants);
  
    // Clear the file state
    setFile(null);
  };
  

  const handleNext = () => {
    // Get the current applicant's documents
    const currentApplicant = applicants[currentApplicantIndex];
    const numDocs = currentApplicant?.documents?.length || 0;
  
    if (numDocs > 0 && currentDocIndex + 1 < numDocs) {
      // If there are more documents, move to the next document
      setCurrentDocIndex(currentDocIndex + 1);
    } else if (currentApplicantIndex + 1 < applicants.length) {
      // If no more documents, move to the next applicant
      setCurrentApplicantIndex(currentApplicantIndex + 1);
      setCurrentDocIndex(0); // Reset document index to 0 for the new applicant
    }
  };

  const handleBack = () => {
    const currentApplicant = applicants[currentApplicantIndex];
    const numDocs = currentApplicant?.documents?.length || 0;
  
    if (numDocs > 0 && currentDocIndex > 0) {
    
      setCurrentDocIndex(currentDocIndex - 1);
    } else if (currentApplicantIndex > 0) {
     
      setCurrentApplicantIndex(currentApplicantIndex - 1);
      const previousApplicant = applicants[currentApplicantIndex - 1];
      const previousDocIndex = previousApplicant?.documents?.length - 1;
      setCurrentDocIndex(previousDocIndex); 
    }
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
  
    console.log("Updated Applicants:", updatedApplicants); 
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
      <Stack direction="row" alignItems="center" justifyContent="space-between" style={{ padding: 16 }}>
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
      sm={3}
      md={2}
      key={applicant.id}
      onClick={() => setCurrentApplicantIndex(index)}
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
      <Box style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', width: '100%', alignItems: 'center' }}>
        <Grid container spacing={2} style={{ padding: 16, maxWidth: '30%' }}>
          {applicants.length > 0 && (
            <Grid item key={applicants[currentApplicantIndex]?.id}>
              <Paper variant="outlined" style={{ padding: 16 }}>
                <Typography variant="h6">Documents for {applicants[currentApplicantIndex]?.name}</Typography>

                {/* Display documents for the selected applicant */}
                {applicants[currentApplicantIndex]?.documents?.length > 0 ? (
                  <Box style={{ marginTop: 16 }}>
                    <Typography variant="body1">Uploaded Documents:</Typography>
                    {applicants[currentApplicantIndex]?.documents?.map((doc, index) => (
                      <Grid item xs={4} sm={3} md={2} key={doc.id} onClick={() => setCurrentDocIndex(index)}>
                        <Paper
                          variant="outlined"
                          style={{
                            padding: 5,
                            backgroundColor: currentDocIndex === index ? 'green' : 'white',
                            width:'10vw',
                            margin:'10px',
                            color: currentDocIndex === index ? 'white' : 'black',
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

        <Stack direction="row" spacing={2} style={{ padding: 16, width: '50%' }}>
          <Paper variant="outlined" style={{ padding: 16, flex: 1 }}>
            <Typography variant="h6">Documents for {applicants[currentApplicantIndex]?.name}</Typography>
            {/* Display documents for the selected applicant */}
            {applicants[currentApplicantIndex]?.documents?.length > 0 ? (
              <Box style={{ marginTop: 16 }}>
                <Typography variant="body1">Uploaded Documents:</Typography>
              </Box>
            ) : (
              <Typography variant="body2" style={{ marginTop: 16 }}>
                No documents uploaded yet.
              </Typography>
            )}

            {/* File upload */}
            <Button variant="contained" component="label" startIcon={<AddIcon />}>
              Choose File
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
            <Button variant="contained" disabled={!file} style={{ marginLeft: 16 , backgroundColor:!file ? 'gray':'blue'}} onClick={handleUpload}>
              Upload
            </Button>
            {/* {file && ( */}
              <Typography variant="body1" style={{ marginTop: 16 }}>
                Selected File: {file?.name || applicants[currentApplicantIndex]?.documents[currentDocIndex]?.file?.name}
              </Typography>
            {/* )} */}
            <Box style={{ marginTop: 16 }}>
              <Typography variant="body2">Drag and Drop files here</Typography>
            </Box>
          </Paper>
        </Stack>
      </Box>

      {/* Navigation buttons for switching applicants */}
      <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center" style={{ padding: 16 }}>
        <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={handleBack} disabled={currentApplicantIndex === 0}>
          Back
        </Button>
        <Button variant="contained" endIcon={<ArrowForwardIcon />} onClick={handleNext} disabled={currentApplicantIndex === applicants.length - 1}>
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
            onChange={handleDocNameChange} // Updated to handle doc name change
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
