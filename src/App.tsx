import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import CharacterCard from './components/character-card'

const queryClient = new QueryClient()

function App() {

    return (
        <QueryClientProvider client={queryClient}>
            <h1 className='text-blue-100 text-5xl font-extrabold text-center'>The Dragon Ball API</h1>

            <CharacterCard />
        </QueryClientProvider>
    )
}

export default App