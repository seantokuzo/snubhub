import axios from 'axios'

const buildClient = ({ req }) => {
  if (typeof window === 'undefined') {
    // ON SERVER
    return axios.create({
      baseURL: 'http://snubhhub-app-prod.online',
      headers: req.headers
    })
  } else {
    // ON CLIENT
    return axios.create({
      baseURL: '/'
    })
  }
}

export default buildClient
