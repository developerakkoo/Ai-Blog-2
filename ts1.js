

// const io = require('socket.io-client');
// console.log('here')
// const socket = io('http://192.168.0.113:3000'); // Replace with the actual IP address of your laptop



// socket.on('connect', () => {
//     console.log('Mobile connected to Socket.io');
//     socket.on('get:Search', (data) => {
//         console.log('Received data:', data);
//         console.log('done');
//         });
//     socket.on('get:SearchData', (data) => {
//     console.log('Received data:', data);
//     console.log('done');
//     });
// });

// socket.on('disconnect', () => {
//     console.log('Mobile disconnected from Socket.io');
// });


const axios = require('axios');
const cheerio = require('cheerio');
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

// URL of the HTML page containing the table data
const url = 'http://www.howstat.com/cricket/statistics/players/PlayerCountryList.asp';

// Function to fetch and extract table data
async function extractTableData() {
  try {
    // Fetch the HTML content from the URL
    const response = await axios.get(url);

    // Load the HTML content into Cheerio
    const $ = cheerio.load(response.data);

    // Replace 'table-selector' with the CSS selector of your table
    const tableSelector = 'table';

    // Select the table based on the CSS selector
    const table = $(tableSelector);

    // Check if the table was found
    if (table.length === 0) {
      console.log('Table not found on the page.');
      return;
    }

    // Create a new Excel workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Table Data');

    // Extract and add table headers to the worksheet
    const headers = [];
    table.find('thead th').each((colIndex, colElement) => {
      headers.push($(colElement).text().trim());
    });
    worksheet.addRow(headers);

    // Extract and add table data to the worksheet
    table.find('tbody tr').each((rowIndex, rowElement) => {
      const rowData = [];
      $(rowElement).find('td').each((colIndex, colElement) => {
        rowData.push($(colElement).text().trim());
      });
      worksheet.addRow(rowData);
    });

    // Save the Excel file
    const excelFileName = 'tableData.xlsx';
    await workbook.xlsx.writeFile(excelFileName);
    console.log(`Table data saved to ${excelFileName}`);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Call the function to extract table data
extractTableData();
