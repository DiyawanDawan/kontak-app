const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const flash = require("connect-flash");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const { body, validationResult, check } = require("express-validator");

require("./utils/db");
const Contact = require("./model/contact");
const { findOne } = require("./model/contact");

const app = express();
const port = 3000;
// app.use(methodOverride('X-HTTP-Method-Override'));
app.use(methodOverride("_method"));

// Gunakan Ejs
app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser("secret"));
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

app.get("/", (req, res) => {
  const mahasiswa = [
    {
      name: "Diyawan",
      email: "diyawandawan@gmai.net",
      noHP: 09849382232,
    },
    {
      name: "Otong",
      email: "surotong@gmail.not",
      noHP: 081234567890,
    },
    {
      name: "Ucup",
      email: "Ucup@info.com",
      noHP: 093456789075,
    },
  ];
  res.render("index", {
    nama: "Diyawan",
    title: "Halaman Home",
    layout: "layouts/main-layouts",
    mahasiswa,
  });
});

// Halaman About
app.get("/about", (req, res) => {
  res.render("about", {
    title: "Halaman About",
    layout: "layouts/main-layouts",
  });
});

// Halaman Kontak
app.get("/contact", async (req, res) => {
  const contacts = await Contact.find();
  res.render("contact", {
    title: "Halaman Kontak",
    layout: "layouts/main-layouts",
    contacts,
    msg: req.flash("msg"),
  });
});

app.get("/contact/add", (req, res) => {
  res.render("add-contact", {
    title: "Halaman Tambah Data",
    layout: "layouts/main-layouts",
  });
});

app.post(
  "/contact",
  [
    body("nama").custom(async (value) => {
      const duplikat = await Contact.findOne({ nama: value });
      if (duplikat) {
        throw new Error("Nama Sudah di Gunakan");
      }
      return true;
    }),
    check("email", "Emial Tidak Falid").isEmail(),
    check("nohp", "No Hp Tidak Falid").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(404).json({ errors: errors.array() });
      res.render("add-contact", {
        title: "Halaman Tambah Data",
        layout: "layouts/main-layouts",
        errors: errors.array(),
      });
    } else {
      Contact.insertMany(req.body, (error, result) => {
        req.flash("msg", "Data Kontak berhasil di tambahahkan");
        res.redirect("/contact");
      });
    }
  }
);

//Delete Kotak
// app.get("/contact/delete/:nama", async (req, res) => {
//   const contact = await Contact.findOne({ nama: req.params.nama });
//   if (!contact) {
//     res.status(404);
//     res.send("<h1>404</h1>");
//   } else {
//     // res.send('Ok')
//     Contact.deleteOne({ _id: contact._id }).then((result) => {
//       req.flash("msg", "Data Berhasil di Hapus");
//       res.redirect("/contact");
//     });
//   }
// });

app.delete("/contact", (req, res) => {
  Contact.deleteOne({ nama: req.body.nama }).then((result) => {
    req.flash("msg", "Data Berhasil di Hapus");
    res.redirect("/contact");
  });
});

// Ubah Data
app.get("/contact/edit/:nama", async (req, res) => {
  const contact = await Contact.findOne({ nama: req.params.nama });
  res.render("edit-contact", {
    title: "Form Edit Data",
    layout: "layouts/main-layouts",
    contact,
  });
});

app.put(
  '/contact',
  [
    body("nama").custom(async (value, { req }) => {
      const duplikat = await Contact.findOne({ nama: value });
      if (value !== req.body.oldNama && duplikat) {
        throw new Error("Nama Sudah di Gunakan");
      }
      return true;
    }),
    check("email", "Emial Tidak Falid").isEmail(),
    check("nohp", "No Hp Tidak Falid").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("edit-contact", {
        title: "Form Ubah Data",
        layout: "layouts/main-layouts",
        errors: errors.array(),
        contact: req.body,
      });
    } else {
      Contact.updateOne({ _id: req.body._id },
         {
          $set: {
            nama: req.body.nama,
            nim: req.body.nim,
            kelas: req.body.kelas,
            semester: req.body.semester,
            email: req.body.email,
            nohp: req.body.nohp,
          }
         }).then((result) => {

           req.flash("msg", "Data Kontak berhasil di Ubah");
           res.redirect("/contact");
         });
    }
  }
);

app.get("/contact/:nama", async (req, res) => {
  const contact = await Contact.findOne({ nama: req.params.nama });
  res.render("detail", {
    title: "Halaman Details Kontak",
    layout: "layouts/main-layouts",
    contact,
  });
});

app.listen(port, () => {
  console.log(`Mongo App Berjalan pada port http://localhost:${port}`);
});

// onsole.log();
