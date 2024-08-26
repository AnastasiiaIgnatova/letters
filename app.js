const express = require("express");
const app = express();
const router = express.Router();
const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");
const htmlTemplate = fs.readFileSync("./views/default-letter.ejs", "utf8");

// Настройка EJS как шаблонизатор
app.set("view engine", "ejs");

// Настройка директории для статических файлов
app.use(express.static(path.join(__dirname, "public")));

async function sendEmail(res) {
  // Настройка транспортера (SMTP сервер)
  let transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "15068281ff921c",
      pass: "f82fc0c129adc3",
    },
  });

  try {
    // Настройка письма с использованием CID
    let mailOptions = {
      from: '"Your Name" <your-email@gmail.com>',
      to: "recipient@example.com",
      subject: "Hello with embedded image",
      html: htmlTemplate,
      attachments: [
        {
          filename: "frame.png",
          path: path.join(__dirname, "public", "assets", "image", "frame.png"),
          cid: "frameImage",
        },
        {
          filename: "logo.png",
          path: path.join(__dirname, "public", "assets", "image", "logo.png"),
          cid: "logoImage",
        },
        {
          filename: "Telegram.png",
          path: path.join(
            __dirname,
            "public",
            "assets",
            "image",
            "Telegram.png"
          ),
          cid: "telegramImage",
        },
      ],
    };
    // Отправка письма
    let info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);

    // Ответ на запрос
    if (res != undefined) {
      res.send("Email sent successfully!");
    }
  } catch (error) {
    console.error("Error sending email:", error);
    if (res != undefined) {
      res.status(500).send("Error sending email");
    }
  }
}

// Маршрут для отправки письма с CID изображением
router.get("/send-email", async (req, res, next) => {
  sendEmail(res);
});

// Настраиваем рендер страниц
router.get("/default-letter", (req, res, next) => {
  const data = {
    privacyPolicy: "#",
    termsOfService: "#",
    title: "Заголовок письма",
    link: "https://testing.faces-castings.ru/",
    button: "Кнопка действия",
    emailSubject: "Письмо от пользователя FACES",
    message:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Harum distinctio tenetur vero aliquid possimus vel debitis ipsa doloribus quisquam, esse fugit nulla sapiente quidem neque ut voluptates! Non voluptates atque odio rem.",
  };
  res.render("default-letter", data);
});

router.get("/confirmation-email", (req, res, next) => {
  const data = {
    privacyPolicy: "#",
    termsOfService: "#",
    emailSubject: "Письмо от пользователя FACES",
    btnConnect: "#",
  };
  res.render("confirmation-email", data);
});

// Подключаем маршруты
app.use(router);

// Запуск сервера
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
