import smtplib
import os
import email.message

sender = "Private Person <from@example.com>"
receiver = "A Test User <to@example.com>"
data = ""

def main():
    with open(os.path.join(os.path.dirname(__file__), 'letter.html'), encoding = 'utf-8', mode = 'r') as file:
        data = file.read()
        file.close()

    msg = email.message.Message()
    msg['Subject'] = 'NASTYA doing some CRAZY tests!!!1!'
    msg['From'] = sender
    msg['To'] = receiver
    msg.add_header('Content-Type','text/html')
    msg.set_payload(data)

    # Send the message via local SMTP server.
    with smtplib.SMTP("sandbox.smtp.mailtrap.io", 2525) as server:
        server.starttls()
        server.login("15068281ff921c", "f82fc0c129adc3")
        server.sendmail(msg['From'], [msg['To']], msg.as_string().encode('utf-8'))


if __name__ == '__main__':
    main()
