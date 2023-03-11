
const mongoose = require('mongoose');
// membuat skima database
const Contact = mongoose.model('Contact', {
    nama: {
        type: String,
        required: true,
    },
    nim: {
        type: String,
        required: true,
    },
    kelas: {
        type: String,
        required: true,
    },
    semester: {
        type: String,
        required: true,
    },
    nohp: {
        type: String,
        required: true,
    }, 
    email: {
        type: String,
    }
});

module.exports = Contact;