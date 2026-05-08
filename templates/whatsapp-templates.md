# WhatsApp Templates for Meta Approval

## `gym_otp`
Body:
`Your Force Gym OTP is {{1}}. It is valid for 5 minutes. Do not share it.`
Params:
1. `otp_code`

## `gym_daily_digest`
Body:
`Today's summary: {{1}} visits, {{2}} members currently in gym, total {{3}} hours.`
Params:
1. `visit_count`
2. `currently_active_count`
3. `total_hours`

## `gym_inactivity_reminder`
Body:
`Hi {{1}}, we miss you at Force Gym. Your last visit was {{2}}. See you soon!`
Params:
1. `name`
2. `last_visit_relative`

## `gym_weekly_summary`
Body:
`Hi {{1}}, this week you visited {{2}} times and trained for {{3}} hours. Great work!`
Params:
1. `name`
2. `visit_count`
3. `hours`
