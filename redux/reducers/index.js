import { combineReducers } from "redux"
import { User } from "./user"
import { Users } from "./users"
const rootReducer = combineReducers({
   userState: User,
   usersState: Users
})

export default rootReducer
