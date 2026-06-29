const { processCSV } = require('../services/csvParser');

// Handle CSV upload
const uploadCSV = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    // Process the CSV file
    const result = await processCSV(req.file.buffer);

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'CSV file uploaded and parsed successfully',
      recordCount: result.recordCount,
      data: result.data
    });
  } catch (error) {
    console.error('Upload error:', error.message);
    
    // Handle specific validation errors
    if (error.message.includes('Validation errors') || 
        error.message.includes('Missing required columns') ||
        error.message.includes('CSV file is empty')) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }

    // Handle parsing errors
    if (error.message.includes('CSV parsing error')) {
      return res.status(400).json({
        success: false,
        error: 'Failed to parse CSV file. Please check file format.'
      });
    }

    // Handle unexpected errors
    return res.status(500).json({
      success: false,
      error: 'Internal server error during file upload'
    });
  }
};

module.exports = {
  uploadCSV
};
