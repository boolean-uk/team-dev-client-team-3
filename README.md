### Team Dev Client

Client repository for team dev project.

### Set up

1. Copy the `.env.example` file to a new file named `.env` (NOTE: Make sure to copy the file, don't remove the original .env.example)
2. Make sure the `REACT_APP_API_URL` environment variable in the `.env` file contains the URL of the server app on your machine
3. `npm ci` to install dependencies
4. `npm start` to run the app. The server must also be running on your machine

### Project Management

[https://github.com/orgs/boolean-uk/projects/33/views/1](https://github.com/orgs/boolean-uk/projects/33)

### Contributing

- Pull requests should be made from branches following the naming convention: `<username>-<issue_number>-<feature>`, e.g. `vherus-#1-user_registration`

### Playwright testing

Quick guide to keep our end-to-end tests consistent:
1. Install the test runner: `npm ci` or `npm install playwright`
2. Fetch the browser binaries once: `npx playwright install`

Run the suite anytime with `npx playwright test` (add `--headed` if you want to see the browser). Place new specs under the `test` directory so the runner can discover them automatically.

### Randomly seeded users
The backend now implements random seeding of users, creating 300 unique users which can be used for testing. The users are generated with four different passwords and unique hash codes:
- "$2a$11$mbfii1SzR9B7ZtKbYydLOuAPBSA2ziAP0CrsdU8QgubGo2afw7Wuy", // Timianerkul1!
- "$2a$11$5ttNr5DmMLFlyVVv7PFkQOhIstdGTBmSdhMHaQcUOZ8zAgsCqFT6e", // SuperHash!4
- "$2a$11$KBLC6riEn/P78lLCwyi0MO9DrlxapLoGhCfdgXwLU2s44P.StKO/6", // Neidintulling!l33t
- "$2a$11$DFMtyLv243uk2liVbzCxXeshisouexhitDg5OUuBU.4LVn//QG5O."  // lettPassord123!

To log in with any of the users, make sure your backend is up to date with the server repo. Add a migration and update your database. The users will then be displayed in a users table in your database. To know which password is correct for a user, check the matching hash in the passwordhash column with the four hash codes above, then use the password for the matching hash, and the email for the user, and log in.
