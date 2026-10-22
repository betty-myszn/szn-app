-- Let the LA (in-person) Baddie Coven have its own waitlist alongside the online coven.
alter table waitlist_signups drop constraint if exists waitlist_signups_offer_check;
alter table waitlist_signups add constraint waitlist_signups_offer_check
  check (offer in ('mastermind','rich-btch-rising','bad-btch-report','baddie-coven','baddie-coven-la','retreat','book'));
