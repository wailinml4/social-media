import type { Response } from 'express'

const setCookie = (res: Response, token: string): void => {
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'Lax' as 'lax',
    secure: false,
    maxAge: 3600000,
  })
}

export default setCookie
