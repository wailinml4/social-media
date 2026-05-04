const setCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'Lax',
    secure: false,
    maxAge: 3600000,
  })
}

export default setCookie
