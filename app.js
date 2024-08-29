const express = require("express");
const app = express();
const router = express.Router();
const nodemailer = require("nodemailer");
const path = require("path");

// Настройка EJS как шаблонизатор
app.set("view engine", "ejs");

// Настройка директории для статических файлов
app.use(express.static(path.join(__dirname, "public")));

async function sendEmail(res, template, data) {
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
    // Рендерим EJS шаблон в HTML с переданными данными
    const htmlTemplate = await new Promise((resolve, reject) => {
      app.render(template, data, (err, html) => {
        if (err) reject(err);
        else resolve(html);
      });
    });

    // Настройка письма с использованием CID
    let mailOptions = {
      from: '"Your Name" <your-email@gmail.com>',
      to: "recipient@example.com",
      subject: data.emailSubject || "Hello with embedded image",
      html: htmlTemplate,
      attachments: [
        {
          filename: "logo.png",
          path: path.join(__dirname, "public", "assets", "image", "logo.png"),
          cid: "logoImage",
        },
        {
          filename: "frame.png",
          path: path.join(__dirname, "public", "assets", "image", "frame.png"),
          cid: "frameImage",
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

// Маршрут для отправки письма (универсальный)
router.get("/send-email", async (req, res, next) => {
  const emailType = req.query.type || "default"; // Определяем тип письма

  let data;
  let template;

  if (emailType === "confirmation") {
    // Данные для confirmation-email
    template = "confirmation";
    data = {
      title: "Подтверждение адреса электронной почты",
      message:
        "Перейдите по ссылке ниже для подтверждения адреса электронной почты",
      privacyPolicy: "#",
      termsOfService: "#",
      emailSubject: "Подтверждение адреса электронной почты",
      link: "https://testing.faces-castings.ru/",
      textBtn: "Присоединиться",
    };
  } else {
    // Данные для default-letter
    template = "default-letter";
    data = {
      privacyPolicy: "#",
      termsOfService: "#",
      title: "Заголовок письма",
      link: "https://testing.faces-castings.ru/",
      button: "Кнопка действия",
      textBtn: "восстановление пароля",
      emailSubject: "Письмо от пользователя FACES",
      message:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Harum distinctio tenetur vero aliquid possimus vel debitis ipsa doloribus quisquam, esse fugit nulla sapiente quidem neque ut voluptates! Non voluptates atque odio rem.",
    };
  }

  // Передаем данные и рендерим письмо
  await sendEmail(res, template, data);
});

// Маршрут для рендера страницы (для теста)
router.get("/default-letter", (req, res, next) => {
  const data = {
    privacyPolicy: "#",
    termsOfService: "#",
    title: "Заголовок письма",
    link: "https://testing.faces-castings.ru/",
    button: "Кнопка действия",
    textBtn: "восстановление пароля",
    emailSubject: "Письмо от пользователя FACES",
    message:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Harum distinctio tenetur vero aliquid possimus vel debitis ipsa doloribus quisquam, esse fugit nulla sapiente quidem neque ut voluptates! Non voluptates atque odio rem.",
  };
  res.render("default-letter", data);
});

router.get("/confirmation", (req, res, next) => {
  const data = {
    title: "Подтверждение адреса электронной почты",
    message:
      "Перейдите по ссылке ниже для подтверждения адреса электронной почты",
    privacyPolicy: "#",
    termsOfService: "#",
    emailSubject: "Подтверждение адреса электронной почты",
    link: "https://testing.faces-castings.ru/",
    textBtn: "Присоединиться",
  };
  res.render("confirmation", data);
});

// Подключаем маршруты
app.use(router);

// Запуск сервера
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
