import html2pdf from 'html2pdf.js';

/**
 * Utility to generate and download a PDF report from a DOM element.
 * 
 * @param elementId The ID of the DOM element to convert to PDF.
 * @param filename The desired filename for the downloaded PDF.
 */
export const generatePDFReport = async (elementId: string, filename: string = 'interview-report.pdf') => {
  const element = document.getElementById(elementId);
  
  if (!element) {
    console.error(`Element with id ${elementId} not found.`);
    throw new Error('Could not generate PDF: Report element not found');
  }

  // Configuration for html2pdf
  const opt = {
    margin:       10, // top, left, bottom, right in mm
    filename:     filename,
    image:        { type: 'jpeg' as 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true, logging: false, backgroundColor: '#09090b' },
    jsPDF:        { unit: 'mm' as 'mm', format: 'a4' as 'a4', orientation: 'portrait' as 'portrait' }
  };

  // Add a temporary class to format it for PDF if needed
  element.classList.add('pdf-export-mode');

  try {
    await html2pdf().set(opt).from(element).save();
  } finally {
    // Remove the class after export
    element.classList.remove('pdf-export-mode');
  }
};
