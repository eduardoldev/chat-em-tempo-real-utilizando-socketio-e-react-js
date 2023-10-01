import { useEffect, useRef, useState } from "react";
import { Button, Row, Col, Form } from "react-bootstrap"
import io from 'socket.io-client'
const socket = io('http://localhost:8080', { transports: ['websocket'] });
socket.on('connection', () => { console.log("[OI] Connect => New Connection.") });

function App() {
  const chatRef = useRef();
  const [message, setMessage] = useState("");
  const [mensagens, setMensagens] = useState([])
  const [nome, setNome] = useState(`Usuário#${Math.floor(Math.random() * 10000).toString().padStart(5, '0')}`);

  const handleSendMessage = event => {
    event.preventDefault();
    if (message.trim()) {
      const newMessageSend = { usuario: nome, message }
      socket.emit("chat.message", newMessageSend);
      setMessage("");
    }
  }
  const AlwaysScrollToBottom = () => {
    const chatRef = useRef();
    useEffect(() => chatRef.current.scrollIntoView({ behaviour: 'smooth' }));
    return <div ref={chatRef} />;
  };

  useEffect(() => {
    const handleNewMessage = (message) => setMensagens(prev => [...prev, message])
    socket.on('chat.message', handleNewMessage);
    return () => socket.off('chat.message', handleNewMessage);
  }, [])

  return (
    <div className="bg-dark p-3">
      <Row className=" d-flex justify-content-center  m-3 p-3 border  bg-dark rounded">
        <Row className="bg-dark rounded p-3 d-flex justify-content-center">
          <Row className="bg-white border p-3 rounded overflow-auto" style={{ height: '80vh' }}>
            <ul className="p-3 m-0">
              {mensagens.map((mensagem, index) => {
                return (
                  <li key={index} className={mensagem.usuario == nome?'nav-link d-flex w-100':'nav-link d-flex w-100 justify-content-end'} ><span className={mensagem.usuario == nome ? "text-bg-success p-3 m-1 rounded" : "text-bg-primary p-3 m-1 rounded text-end"}>{mensagem.usuario}: {mensagem.message}</span></li>
                )
              })}
              <AlwaysScrollToBottom />
            </ul>
          </Row>
        </Row>
        <Row className="m-0 p-3  " >
          <Form onSubmit={(e) => { handleSendMessage(e) }}>
            <Row className="d-flex align-items-center">
              <Col sm={10}>
                <input value={message} onChange={(e) => { setMessage(e.target.value) }} type="text" className="w-100 h-100 m-0 form-control"></input>
              </Col>
              <Col sm={2}>
                <Button type="submit" variant="primary" className="w-100" > Enviar</Button>
              </Col>
            </Row>
          </Form>
        </Row>
      </Row >
    </div >
  )
}

export default App
