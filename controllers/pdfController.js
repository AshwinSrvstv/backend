const PDFDocument = require('pdfkit');
const fs = require('fs');

exports.generatePDF = async (req, res) => {
    try {
        const { templateContent, employeeName, date } = req.body;

        // Replace placeholders in the template
        const filledContent = templateContent.replace('[Employee Name]', employeeName).replace('[Date]', date);

        // Create a new PDF document
        const doc = new PDFDocument();
        const pdfPath = `temp_${Date.now()}.pdf`;

        // Pipe the PDF to a file
        doc.pipe(fs.createWriteStream(pdfPath));
        doc.text(filledContent);
        doc.end();

        // Send the file to the client and delete after download
        doc.on('end', () => {
            res.download(pdfPath, () => {
                fs.unlinkSync(pdfPath);
            });
        });
    } catch (error) {
        res.status(500).json({ error: 'Error generating PDF' });
    }
};
