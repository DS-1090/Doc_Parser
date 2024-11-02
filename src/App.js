import React, { useState } from 'react';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Box from '@mui/material/Box';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';

function App() {
  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
    backgroundColor: '#000080',
  });

  const [file, setFile] = useState(null);
  const [output, setOutput] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const ChangeFile = async (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
      //await UploadFile(selectedFile);
    }
    else {
      setError('Select a valid image file');
      setFile(null);
    }
  };

  const UploadFile = async () => {
    if (!file) {
      setError('No file is selected');
      return;
    }
    console.log(file)
    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8000/api/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setOutput(response.data);
    }
    catch (err) {
      setError('Error in uploading file');
    }
    setLoading(false);

  };

  return (
    <div style={{ backgroundColor: '#2C3E50', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ width: 'fit-content', height: 'fit-content', padding: '20px', fontFamily: 'Arial, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', backgroundColor: '#fff', borderRadius: '4px' }}>
        <h1 style={{ color: '#C4C5C5', fontSize: '4rem' }}>
          <DocumentScannerIcon style={{ fontSize: '50px', marginRight: '7px' }} />
          Doc Parser
        </h1>

        <div style={{ display: 'flex' }}>
          <Button
            component="label"
            variant="contained"
            disabled={loading}
            style={{ margin: '10px', backgroundColor: '#3498DB', color: '#fff' }}
            startIcon={<CloudUploadIcon />}

          >
            {loading ? 'Uploading' : 'Upload File'}
            <VisuallyHiddenInput
              type="file"
              onChange={ChangeFile}
            />
          </Button>
          {file && <p >{file.name}</p>}
        </div>
        {!loading && (<Button onClick={UploadFile} disabled={loading}
          style={{ backgroundColor: '#E67E22', color: '#fff' }}
        >       Select
        </Button>)}

        {error && <p style={{ color: 'red', fontFamily: 'Arial, sans-serif' }}>{error}</p>}
        {output && (


          <Box component="section" sx={{ marginTop: '30px', p: 2, padding: '10px', width: 'fit-content' }}>
            {/* <h2 style={{ margin: '0px 5px', color: '#000080', fontSize: '2rem' }}>Profile Information:</h2> */}
            <p style={{ margin: '10px 0', whiteSpace: 'pre-wrap', wordWrap: 'break-word', fontSize: '1rem' }}>
              <br />
              {output
                ? Object.entries(output).map(([key, value]) => `${key}: ${value}`).join('\n\n')
                : 'No data available'}
            </p>
          </Box>



        )}
      </div>
    </div>
  );
}

export default App;
