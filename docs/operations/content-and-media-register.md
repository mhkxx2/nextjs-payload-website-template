# Content and media register — Al Rukn Furniture

Generated: **2026-09-21** — regenerated from the repository, never hand-edited independently.

Authoritative sources:

- launch copy: `src/seed/services.ts`, `src/seed/site.ts`, `src/seed/business.ts`
- image provenance and checksums: `src/seed/media-manifest.json`
- records created per seed batch (rollback registry): `docs/operations/seed-batches.json`

## 1. Content register

| Collection | Records | Identifiers |
| --- | --- | --- |
| `services` | 9 | `sofa-upholstery`, `custom-furniture`, `custom-sofa`, `majlis-furniture`, `curtains-blinds`, `sofa-repair`, `custom-wardrobes`, `custom-beds-headboards`, `office-furniture` |
| `faqs` | 22 | groups: `general`, `services`, `process`, `materials-care`, `pricing-quotations` |
| `pages` | 3 | `home`, `privacy`, `terms` |
| globals | 6 | `site-settings`, `contact-information`, `header`, `footer`, `seo-defaults`, `social-media` |

Homepage block order (asserted by `tests/unit/content-integrity.test.ts`):
`hero` → `serviceGrid` → `benefits` → `processSteps` → `splitContent` → `projectGallery` → `testimonials` → `faqs` → `locationCoverage` → `quoteForm` → `callToAction`

Service titles as seeded:

- `sofa-upholstery` — Sofa Upholstery
- `custom-furniture` — Custom Furniture
- `custom-sofa` — Custom Sofa
- `majlis-furniture` — Majlis Furniture
- `curtains-blinds` — Curtains & Blinds
- `sofa-repair` — Sofa Repair
- `custom-wardrobes` — Custom Wardrobes
- `custom-beds-headboards` — Beds & Headboards
- `office-furniture` — Office Furniture

### Deliberately not seeded

Nothing in the seed asserts facts the business has not supplied. In particular there
are no testimonials, no counters or statistics, no years of trading, no project counts,
no guarantees, and no awards. The `testimonials` collection refuses publication unless a
consent/verification note and date are present (`src/collections/Testimonials.ts`), so it
stays empty until the business supplies verified, consented quotes.

## 2. Media register (12 placeholder images)

Every launch image is royalty-free placeholder photography, imported through the Media
collection with alt text, caption, focal point, source URL, and license notes. Replace
them with the workshop's own photography whenever it is available — nothing in the code
or the layout depends on these exact files.

| Key | File | Intended use | Creator | License | Source | SHA-256 |
| --- | --- | --- | --- | --- | --- | --- |
| `hero-living-room` | `hero-living-room.jpg` | Homepage hero image | Caroline Badran | Unsplash License | [source](https://unsplash.com/photos/a-modern-peach-sofa-with-pillows-in-a-room-in2D_wh4sq8) | `6938a9f008b6…` |
| `service-sofa-upholstery` | `service-sofa-upholstery.jpg` | Sofa upholstery service card | Lisa Amann | Unsplash License | [source](https://unsplash.com/photos/green-sofa-with-striped-cushions-lDAkoo6TpWE) | `68fc907e3d11…` |
| `service-custom-furniture` | `service-custom-furniture.jpg` | Custom furniture service card | Craft Kitties | Unsplash License | [source](https://unsplash.com/photos/person-marking-wooden-board-with-pencil-GfYA6q5ESLI) | `e236d5d56305…` |
| `service-custom-sofa` | `service-custom-sofa.jpg` | Custom sofa service card | Jean-Philippe Delberghe | Unsplash License | [source](https://unsplash.com/photos/a-close-up-of-a-sheet-of-paper-with-different-colors-W72t0b-bmb0) | `085fc8e5616b…` |
| `service-majlis-furniture` | `service-majlis-furniture.jpg` | Majlis furniture service card | Rafael Peier | Unsplash License | [source](https://unsplash.com/photos/long-room-with-red-carpets-x1zKWzhrPQE) | `5ac30b192f4d…` |
| `service-curtains-blinds` | `service-curtains-blinds.jpg` | Curtains and blinds service card | GLOBALDSIO IT SOLUTION | Unsplash License | [source](https://unsplash.com/photos/cream-curtains-hang-over-a-window-with-a-lamp-EcusinlsfwI) | `06f3d4401e85…` |
| `service-sofa-repair` | `service-sofa-repair.jpg` | Sofa repair service card | Haupes | Unsplash License | [source](https://unsplash.com/photos/assorted-shoe-tool-kit-I7iJOE4fsYo) | `b4bc92828b0a…` |
| `service-custom-wardrobes` | `service-custom-wardrobes.jpg` | Custom wardrobes service card | Roberto Nickson | Unsplash License | [source](https://unsplash.com/photos/two-black-metal-framed-beige-padded-chair-with-round-coffee-table-ZXbDeof0nlQ) | `a31b824f7f62…` |
| `service-custom-beds-headboards` | `service-custom-beds-headboards.jpg` | Beds and headboards service card | Julia Mayo | Unsplash License | [source](https://unsplash.com/photos/a-bed-with-a-white-comforter-and-pillows-dLlg3m-2e6g) | `f5a8dd5d39cb…` |
| `service-office-furniture` | `service-office-furniture.jpg` | Office furniture service card | Adolfo Félix | Unsplash License | [source](https://unsplash.com/photos/office-workspace-with-white-desks-PG8NyM_Mcts) | `33128ee88f69…` |
| `about-workshop` | `about-workshop.jpg` | About page supporting image | Collab Media | Unsplash License | [source](https://unsplash.com/photos/a-person-that-is-cutting-a-piece-of-wood-Q3stHYxwJWM) | `0ddcd6f25ba3…` |
| `og-default` | `og-default.jpg` | Open Graph and social share default | Albero Furniture Bratislava | Unsplash License | [source](https://unsplash.com/photos/a-living-room-filled-with-furniture-and-a-wooden-floor-3RfIi22Y97Y) | `6bb698d1ab49…` |

License basis for all 12 entries: **Unsplash License** (https://unsplash.com/license) —
royalty-free for commercial and non-commercial use, permission not required, credited
voluntarily. Checksums were verified locally after download; `placeholder: true` marks
every current file.

### Full checksums (SHA-256)

```
hero-living-room.jpg                   6938a9f008b657f7bd1ed43862a12e29661e5fff190ee0ce26024a7610b67b0f
service-sofa-upholstery.jpg            68fc907e3d11eb481e93e9cd34d5e78ac0f99456da0eb91e54b0b3260c213699
service-custom-furniture.jpg           e236d5d56305891e0a067703ea4301b180cda5758b13bf603e668d989623972f
service-custom-sofa.jpg                085fc8e5616bcdcb1b79f3a65bd734122c521e8b3db8bc4f678899cac0ab9969
service-majlis-furniture.jpg           5ac30b192f4d2be9bdb54881f8c70cfe316609a420287ac6431651e10a717168
service-curtains-blinds.jpg            06f3d4401e858e09559cb5fc270c679d26158c9dbcc1b8fa5b75365503798906
service-sofa-repair.jpg                b4bc92828b0af3a9587372952504aa05828d1749dd36b4be9414bb2b1501199e
service-custom-wardrobes.jpg           a31b824f7f62e3fe51186870aeea0a4f8a5b50d5e7d5efc3adf2e96369f21d29
service-custom-beds-headboards.jpg     f5a8dd5d39cb6e83f281741ce8759c39be2ebccea34bc6760ebf24a82608f916
service-office-furniture.jpg           33128ee88f694b8fb819eabc1891c957868447e6b6bdac9ede6f7e4a8503dad0
about-workshop.jpg                     0ddcd6f25ba3bdc516ffa8bbfe63eddb48e31a05b35f068bb655e240b006b6d1
og-default.jpg                         6bb698d1ab49f0a5f32010bb1bb524db3f5fe8e58cec4f29f76d22169bf294e4
```

## 3. Verified business facts

Only these facts come from the client's Google Maps listing
([https://www.google.com/maps?cid=6740373205854748574&hl=en](https://www.google.com/maps?cid=6740373205854748574&hl=en)) and the
client-supplied mailbox:

- legal name: AL RUKN FURNITURE UPHOLSTERY
- brand name: Al Rukn Furniture
- email: `info@alruknfurniture.ae`
- phone / WhatsApp: +971 55 122 4902
- address: CGMC+486, Al Jerf 1, Ajman, United Arab Emirates
- opening time: Opens 8 am (every day)
- category on the listing: Furniture manufacturer
- coordinates: 25.432793, 55.5207684
- service areas stated in copy: Ajman, Al Jerf 1, Al Nuaimiya, Al Rashidiya

## 4. Replacing an image later

The seed is editor-safe: it matches media by the stable marker `seed-asset:<key>` and by
filename, and it will **not** overwrite a record that changed since the seed last wrote
it. So an image replaced in the admin survives every later seed run.

1. Sign in to the admin panel and open **Media**.
2. Either (a) open the placeholder record and upload the replacement file into it, or
   (b) upload the new image as a new record.
3. For (b), edit the page or service that uses the image and select the new file, then
   save. Update alt text, caption, focal point, and the source/license notes so the
   provenance record stays truthful.
4. Keep `docs/operations/content-and-media-register.md` honest: re-run the seed's
   verification commands (section 5) and update this register when the set of files
   changes.

`SEED_FORCE=true pnpm seed` (non-production only) restores the seeded values and is the
only way the placeholders come back.

## 5. Verification evidence

```bash
pnpm seed && pnpm seed                      # second run must report `created: 0`
pnpm vitest run tests/integration/seed.test.ts
pnpm vitest run tests/unit/content-integrity.test.ts
pnpm template:check                          # no template/demo artifact remains
```

Expected: the second seed creates nothing, all 8 integration seed tests and 9 unit
integrity tests pass, and the media checksums above match the files in `src/seed/assets/`.
