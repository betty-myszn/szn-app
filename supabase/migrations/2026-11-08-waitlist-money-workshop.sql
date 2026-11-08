-- The free money workshop (Sunday 15 November 2026) registers through the waitlist.
alter table waitlist_signups drop constraint if exists waitlist_signups_offer_check;
alter table waitlist_signups add constraint waitlist_signups_offer_check
  check (offer in ('mastermind','rich-btch-rising','bad-btch-report','baddie-coven','baddie-coven-la','retreat','book','money-workshop'));
