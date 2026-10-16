import { useContext, createContext, useState } from "react"; 

const UserContext = createContext()
export function useUserContext() {
  return useContext(UserContext)
}

export default function UserRoleContext({children}) {
  const [userRole, setUserRole] = useState('')
  
  return (
    <UserContext.Provider value={{userRole, setUserRole}}>
        {children}
    </UserContext.Provider>
  )
}