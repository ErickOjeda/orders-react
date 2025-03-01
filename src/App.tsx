import Table from './components/Table'
import './App.css'
import NavBar from './components/NavBar'
import { Container} from '@mui/material'
import BasicModal from './components/BasicModal'

function App() {

  return (
    <>
      <NavBar />
      <Container maxWidth="md" sx={{ mt: 15 }}>
        <Table />
      </Container>
      <BasicModal></BasicModal>
    </>
  )
}

export default App
