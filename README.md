# Project description
This lib is a fast way to create a User crud with login and mail recovery, build over AdonisJS.

# Instalation process
npm: 
<pre>
    npm i @pd-solucoes/adonis-basic-crud
</pre>


yarn: 
<pre>
    yarn add @pd-solucoes/adonis-basic-crud
</pre>


# Configuration
This project needs some configurations on host project.

In your .env file is necessary to add soma variables.
<pre>
    # JWT
    SECRET_JWT=YOUR_SECRET

    # EMAIL

    EMAIL_DRIVER=smtp # Only accepts smtp or ses

    FROM_EMAIL=example@email.com

    # SMTP CONFIG
    SMTP_HOST=YOUR_SMTP_HOST
    SMTP_PORT=YOUR_SMTP_PORT
    SMTP_USERNAME=YOUR_SMTP_USERNAME
    SMTP_PASSWORD=YOUR_SMTP_PASSWORD

    # SES CONFIG
    SES_ACCESS_KEY=YOUR_AWS_KEY
    SES_ACCESS_SECRET=YOUR_AWS_SECRET
    SES_REGION=YOUR_AWS_REGION
    CACHE_VIEWS=YOUR_AWS_CACHE_CONFIG

    # URL WHERE FRONTEND IS LOCATED
    APP_WEB_URL=YOUR_WEB_APP_URL
</pre> 

In your routes file (./start/routes), need to import routes from LIB.
<pre>
    import '@pdsolucoes/adonis-basic-crud'
</pre> 


## Database config
Your project need to config database connection,
configuration can be found at this link: [adonis databse configuration](https://docs.adonisjs.com/guides/database/introduction)

Befere step above you will need create some migrations.

User:
<pre>
import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name')
      table.string('email')
      table.string('password')
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

</pre>

Tokens:
<pre>
import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Tokens extends BaseSchema {
  protected tableName = 'tokens'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.bigInteger('user_id').references('id').inTable('users')
      table.string('token').unique()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
</pre>

## Mailer config
Your project also needs to install and configure mail providers, configuration can be found at this link: [adonis mailer config](https://docs.adonisjs.com/guides/mailer)
Project only support this two email providers: SES and SMTP

# Lib resources

The lib provides de follow routes:

| HTTP VERB | ROUTE SUFFIX | BODY | AUTHORIZATION | AUTHORIZATION TYPE|
|-|-|-|-|-|
| POST | /users | ```{"name": "exampe", "email": "example@email.com","password": "mySecretPassword"}``` | false  | - |
| GET | /users | - | true | bearer token|
| PUT | /users | ```{"name": "Update example","email": "example1@email.com"}``` | true | bearer token|
| DELETE | /users | - | true | bearer token|
| POST | /session | ```{"email": "example1@email.com","password": "mySecretPassword"}```| false | - |
| POST | /password/forgot | ```{"email": "example1@email.com"} ``` | false | - |
| POST | /password/reset | ```{"token": "token sent to email","new_password": "myNewSecretPassword","new_password_confirmation": "myNewSecretPassword"}```| false | - |
| POST | /password/change |```{"password": "myActualSecretPassword","new_password": "myNewSecretPassword","new_password_confirmation": "MyNewSecretPassword"}``` | true | bearer token|



This lib provides a auth middleware to use in your host project.
 On use this middleware it automatically provides a user to request.

User object is like that:
```js
user: {
    id: '1'
}
```

Example, turns /hello route in private route:

 ```js
    import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
    import Route from '@ioc:Adonis/Core/Route'

    import {auth} from "@pdsolucoes/adonis-basic-crud"

    Route.post('hello', ({request, response}: HttpContextContract) => {
        return response.ok({
            ok:true
        })
    }).middleware(auth.authenticate)


 ```

In order to avoid type errors is recomended use the exported AuthHttpContract from lib.

Example, in hello routes need to show logged user_id:

 ```js
    import Route from '@ioc:Adonis/Core/Route'

    import {auth, AuthHttpContract} from "@pdsolucoes/adonis-basic-crud"

    Route.post('hello', ({request, response}: AuthHttpContract) => {
        return response.ok({
            ok:true,
            logged_user: request.user.id
        })
    }).middleware(auth.authenticate)


 ```

This lib also provide a generic error handler.
In order to use this functionality is needed to use StatusCode enum.

Examaple:
```js
  import {GenericExceptionHandler, StatusCode} from "@pdsolucoes/adonis-basic-crud"

  throw new GenericExceptionHandler("My error message", StatusCode.Forbidden)
    

```