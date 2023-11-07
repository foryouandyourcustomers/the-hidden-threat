import { SUMMARY_MAIL_FROM, SUMMARY_MAIL_TO } from '$env/static/private'
import type { SharedGameContext } from '$lib/game/types'
import { getGameSummary, getGameSummaryFilename } from '$lib/game/utils'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  sendmail: true,
  newline: 'unix',
  path: '/usr/sbin/sendmail',
})

export const sendSummaryEmail = async (context: SharedGameContext) =>
  new Promise((resolve, reject) => {
    try {
      transporter.sendMail(
        {
          from: SUMMARY_MAIL_FROM,
          to: SUMMARY_MAIL_TO,
          subject: 'The Hidden Threat',
          text: 'Im Anhang befindet sich das JSON mit allen Informationen zum Spiel.',
          attachments: [
            {
              filename: getGameSummaryFilename(context),
              contentType: 'application/json',
              content: JSON.stringify(getGameSummary(context), null, 2),
            },
          ],
        },
        (err, info) => {
          if (err) {
            console.error(err)
            reject(err)
          } else {
            resolve(info)
          }
        },
      )
    } catch (e) {
      console.error(e)
      reject(e)
    }
  })
