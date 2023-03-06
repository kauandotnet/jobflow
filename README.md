# JobFlow
JobFlow is a web application that provides a platform for freelancers to find jobs, manage contracts, and track their earnings. The application includes several features such as job listings, contract management, payment processing, and performance tracking.

## Getting Started
To run JobFlow locally, you will need to have Node.js installed on your machine. Once installed, follow these steps:

```sh
npm install
npm start
```
The application will be accessible at http://localhost:3001 in your browser.

### Technologies Used
JobFlow is built using the following technologies:

- Node.js
- Express.js
- MongoDB

### Contributing
If you are interested in contributing to JobFlow, please fork the repository and submit a pull request. We are always looking for new ideas and contributions to improve the platform.



### Routes

| Path                      | Description                                                      |
|---------------------------|------------------------------------------------------------------|
| /admin/best-profession    | Get the best profession based on earnings for a given date range |
| /admin/best-clients       | Get the list of clients who paid the most for a given date range |
| /balances/deposit/:userId | Deposit funds into a user's account.                             |
| /contracts/:id            | Get the details of a contract.                                   |
| /contracts                | Get a list of all contracts.                                     |
| /jobs/unpaid              | Get a list of all unpaid jobs for the authenticated user         |
| /jobs/:job_id/pay         |  Pay for a specific job                                          |
