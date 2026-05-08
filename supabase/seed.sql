-- Seed gym configuration and a placeholder admin account.
-- Run after schema.sql.

insert into gym_config (
  id,
  gym_name,
  gym_lat,
  gym_lng,
  allowed_radius_m,
  opening_hour,
  closing_hour,
  qr_token,
  qr_token_rotated_at,
  owner_phone
)
values (
  1,
  'Force Gym Bhopal',
  23.282028,
  77.459806,
  150,
  5,
  23,
  'replace-this-with-strong-random-qr-token',
  now(),
  '+919999999999'
)
on conflict (id) do update set
  gym_name = excluded.gym_name,
  gym_lat = excluded.gym_lat,
  gym_lng = excluded.gym_lng,
  allowed_radius_m = excluded.allowed_radius_m,
  opening_hour = excluded.opening_hour,
  closing_hour = excluded.closing_hour,
  owner_phone = excluded.owner_phone;

-- Generate a bcrypt hash example (Node.js):
-- node -e "const bcrypt=require('bcryptjs'); bcrypt.hash('ChangeMe@123',12).then(console.log)"
-- Replace the hash below with your generated value before production use.
insert into admins (username, password_hash)
values ('owner', '$2a$12$uDWV3Ym3TXKCmfTKzpFCa.IYQMmiMfRoN0pwZuSYi/eulrW5zlZIW')
on conflict (username) do nothing;
