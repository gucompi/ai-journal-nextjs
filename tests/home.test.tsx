import {render, screen} from '@testing-library/react'
import {vi} from 'vitest'

import Home from '@/app/page'


vi.mock('@clerk/nextjs', ()=> {
    return {
        auth: () => new Promise((resolve) => resolve({userId: '123'})), 
        ClerkProvider: ({children}) => <div>children</div>,
        useUser: () => ({isSignedIn:true,user:{id:"123",firstName: 'John', lastName: 'Doe'}})
    }
})

test("Home",async () => {
    render(await Home())
    expect(screen.getByText("The Best Journal App.")).toBeTruthy()
});
