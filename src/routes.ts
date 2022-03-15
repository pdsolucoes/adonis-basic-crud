/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import ChangePasswordController from './Controllers/Http/ChangePasswordController'
import ForgotPasswordController from './Controllers/Http/ForgotPasswordController'
import ResetPasswordController from './Controllers/Http/ResetPasswordController'
import SessionController from './Controllers/Http/SessionController'
import UsersController from './Controllers/Http/UsersController'
import auth from './Middleware/auth'
const sessionController = new SessionController()
const usersController = new UsersController()
const forgotPasswordController = new ForgotPasswordController()
const resetPasswordController = new ResetPasswordController()
const changePasswordController = new ChangePasswordController()

Route.post('users', usersController.create)
Route.delete('users', usersController.delete).middleware(auth.authenticate)
Route.put('users', usersController.update).middleware(auth.authenticate)
Route.get('users', usersController.read).middleware(auth.authenticate)

Route.post('session', sessionController.create)

Route.post('password/forgot', forgotPasswordController.create)
Route.post('password/reset', resetPasswordController.create)
Route.post('password/change', changePasswordController.create).middleware(auth.authenticate)



export default Route