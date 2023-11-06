import { SUMMARY_MAIL_TO } from '$env/static/private'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  sendmail: true,
  newline: 'unix',
  path: '/usr/sbin/sendmail',
})

export const sendSummaryEmail = async (summary: string) =>
  new Promise((resolve, reject) => {
    transporter.sendMail(
      {
        from: 'noreply@unibw.de',
        to: SUMMARY_MAIL_TO,
        subject: 'The Hidden Threat',
        text: summary,
      },
      (err, info) => {
        if (err) {
          reject(err)
        } else {
          resolve(info)
        }
      },
    )
  })
