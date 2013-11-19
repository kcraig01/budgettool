Save Yourself
==========
#### To visit the live app, go to: [https://saveyourself.herokuapp.com/](https://saveyourself.herokuapp.com)


#### This app allows users to create pay-off goals for their credit card debt and view local deals if those goals are met.
1. Select Set New Savings Goal
2. Click "Select to enter your account info"
  * Select the bank your credit card is through and enter your username,password, and card # that you use for online access to your account.
  * Enter your estimated monthly income, along with email and city. Submit.
3. Your credit card balance will be populated, along with a suggested payoff amount for the month, based on a % of your income. Feel free to adjust this.
4. Set your savings goal date and submit.

#### Check back in and see if you've met your goal to receive local savings offers.
1. Select Check Past Savings Goals.
2. Enter the account info for the goal you would like to check.
3. Select Check Goal under the goal you would like to verify.
4. If you've met your pay-off amount by your goal date, you will see a list of deals in your area (only those less than what you've paid off of course!)


I built this app utilizing the OFX (Open Financial Exchange) data and the Banking.js api. 
Credit card info is not being stored but passed to the Banking.js api to retrieve OFX data - similar to how Quicken, etc loads your financial data.
