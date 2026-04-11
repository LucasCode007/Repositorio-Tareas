const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://vmqnopncmmxmknjimgao.supabase.co",
  "sb_publishable_vAMv8Wojh6D5kbrUrugQVQ_lyeNfHbR"
);

module.exports = supabase;