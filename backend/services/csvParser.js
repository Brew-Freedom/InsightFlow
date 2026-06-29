const csv = require('csv-parser');
const { Readable } = require('stream');

// Parse CSV buffer and return array of records
const parseCSV = (buffer) => {
  return new Promise((resolve, reject) => {
    const results = [];
    const stream = Readable.from([buffer]);

    stream
      .pipe(csv())
      .on('data', (data) => {
        results.push(data);
      })
      .on('end', () => {
        resolve(results);
      })
      .on('error', (error) => {
        reject(new Error(`CSV parsing error: ${error.message}`));
      });
  });
};

// Validate CSV headers
const validateHeaders = (records) => {
  if (records.length === 0) {
    throw new Error('CSV file is empty');
  }

  const requiredHeaders = ['date', 'campaign', 'impressions', 'clicks', 'conversions', 'revenue'];
  const actualHeaders = Object.keys(records[0]).map(h => h.toLowerCase().trim());

  const missingHeaders = requiredHeaders.filter(h => !actualHeaders.includes(h));
  if (missingHeaders.length > 0) {
    throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
  }

  return true;
};

// Validate data types and values
const validateData = (records) => {
  const errors = [];

  records.forEach((record, index) => {
    // Validate date format
    if (!record.date || isNaN(Date.parse(record.date))) {
      errors.push(`Row ${index + 2}: Invalid date format`);
    }

    // Validate campaign name
    if (!record.campaign || record.campaign.trim() === '') {
      errors.push(`Row ${index + 2}: Campaign name is required`);
    }

    // Validate numeric fields
    const numericFields = ['impressions', 'clicks', 'conversions', 'revenue'];
    numericFields.forEach(field => {
      const value = parseFloat(record[field]);
      if (isNaN(value) || value < 0) {
        errors.push(`Row ${index + 2}: Invalid ${field} value`);
      }
    });
  });

  if (errors.length > 0) {
    throw new Error(`Validation errors:\n${errors.join('\n')}`);
  }

  return true;
};

// Main CSV processing function
const processCSV = async (buffer) => {
  try {
    // Parse CSV
    const records = await parseCSV(buffer);

    // Validate headers
    validateHeaders(records);

    // Validate data
    validateData(records);

    return {
      success: true,
      recordCount: records.length,
      data: records
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  parseCSV,
  validateHeaders,
  validateData,
  processCSV
};
