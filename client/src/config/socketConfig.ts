import io from 'socket.io-client'

import { api } from './config'

const socket = io(api.url)

export default socket
