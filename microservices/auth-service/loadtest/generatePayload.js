module.exports = {
  generatePayload: function(context, events, done) {
    // Ensure context.vars exists
    if (!context.vars) context.vars = {};

    // Generate a unique email
    const randomNumber = Math.floor(Math.random() * 1000000);
    context.vars.email = `gevorg.gak${randomNumber}@gmail.com`;


  }
};
