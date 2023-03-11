const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/wpu', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


// const contact1 = new Contact({
//     nama: 'Didi',
//     nohp: '08324678899',
//     email: 'didi@gmail.io',
// });

// contact1.save().then((contact) => console.log(contact));