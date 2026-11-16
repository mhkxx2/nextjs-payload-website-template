# Sofa Upholstery media register

Selected 2026-10-17. The gallery has **8 images**, all existing company-owned Eco Furniture catalogue assets. The inventory and import report in this directory establish their company-owned source; a read-only Payload check confirmed the source URL, license and local file. Every image was viewed locally. No verified Al Rukn customer project or matched before/after pair was available. These assets are inspiration, not evidence of Al Rukn completed projects.

Source references identify Media records by exact `sourceURL`, `sourceSite=eco-furniture.ae` and `license=Company-owned source asset`, never a database ID. The seed reuses those records without changing them. Fresh isolated databases upload the checked-in WebP fallback. Images are served by Payload, never hotlinked to Eco. Local fallback bytes match the existing imported optimized originals, with hashes in `src/seed/media-manifest.json`.

All eight originals are 1080 × 1080. License: **Company-owned source asset**, based on the approved company-owned Eco inventory and `docs/operations/eco-furniture-portfolio-import-report.json` (908 imported assets). The caption for newly seeded Media is `Company-owned Eco Furniture catalogue inspiration; not a completed Al Rukn customer project.` Existing reused Media without captions uses the gallery's conservative `Design inspiration` fallback; the section introduction identifies all eight as Eco catalogue references. The hero displays the CMS Media caption directly on its image; if an existing borrowed Media record has no caption, the same CMS catalogue introduction is shown as the hero disclosure. The image references that visible figure caption through `aria-describedby`.

| Local fallback | Source asset | Use |
| --- | --- | --- |
| `sofa-eco-nivo.webp` | [Nivo-Modern-Corner-Sofa-main-front-view.jpg](https://eco-furniture.ae/wp-content/uploads/2026/01/Nivo-Modern-Corner-Sofa-main-front-view.jpg) | Gallery 1, hero and corner-sofa card |
| `sofa-eco-elvio.webp` | [Elvio-Modular-Sofa-front-main-view.jpg](https://eco-furniture.ae/wp-content/uploads/2026/01/Elvio-Modular-Sofa-front-main-view.jpg) | Gallery 2, L-shaped sofa card |
| `sofa-eco-elvio-detail.webp` | [Elvio-Modular-Sofa-close-view.jpg](https://eco-furniture.ae/wp-content/uploads/2026/01/Elvio-Modular-Sofa-close-view.jpg) | Gallery 3, foam card and woven-fabric reference |
| `sofa-eco-averon.webp` | [Averon-Smart-Modular-Sectional-Sofa-front-main-view.jpg](https://eco-furniture.ae/wp-content/uploads/2026/01/Averon-Smart-Modular-Sectional-Sofa-front-main-view.jpg) | Gallery 4 |
| `sofa-eco-aura.webp` | [Aura-Modular-Velvet-Sectional-Sofa-front-view-main.jpg](https://eco-furniture.ae/wp-content/uploads/2026/01/Aura-Modular-Velvet-Sectional-Sofa-front-view-main.jpg) | Gallery 5, velvet reference |
| `sofa-eco-aura-detail.webp` | [Aura-Modular-Velvet-Sectional-Sofa-close-view.jpg](https://eco-furniture.ae/wp-content/uploads/2026/01/Aura-Modular-Velvet-Sectional-Sofa-close-view.jpg) | Gallery 6, fabric-replacement card and velvet reference |
| `sofa-eco-arco.webp` | [Artboard-1-9.png](https://eco-furniture.ae/wp-content/uploads/2025/09/Artboard-1-9.png) | Gallery 7, chair card and texture reference |
| `sofa-eco-two-tone.webp` | [8-2.png](https://eco-furniture.ae/wp-content/uploads/2025/09/8-2.png) | Gallery 8, full-sofa card |

Fabric imagery illustrates a texture or construction discussion, not a certified material swatch. The Arco source product is called Bouclé, but this image alone does not verify a fabric specification. Current fabric samples and care instructions must be confirmed for each quotation. No performance, stain-proof, pet-proof, outdoor or fire-rating claim is made.

The following existing AI support assets are reused rather than generating more imagery. All have source `https://openai.com/index/image-generation-api/`, creator OpenAI image generation, and license **AI-generated original — OpenAI Terms of Use** (`https://openai.com/policies/terms-of-use/`). Their original hashes and captions remain in the manifest. The guide eyebrow explicitly says catalogue and AI inspiration.

| Existing asset | Placement | Honest interpretation |
| --- | --- | --- |
| `service-sofa-repair-detail-ai.webp` | Frame-support card | AI-generated sofa repair illustration, not an actual repair |
| `service-majlis-furniture-detail-ai.webp` | Majlis cushion card | AI-generated cushion inspiration |
| `service-custom-beds-headboards-detail-ai.webp` | Coming Soon card and teaser | AI-generated headboard detail inspiration; service not offered |
| `service-sofa-upholstery-detail-ai.webp` | Chenille guide | AI-generated general fabric/foam detail, not a verified chenille sample |
| `service-custom-sofa-detail-ai.webp` | Linen blend guide | AI-generated general material-selection inspiration, not a verified linen sample |

Existing technical feature sections use the first two gallery catalogue assets, under the global inspiration statement. Related-service images are resolved from each existing related Service record. Those remain its existing documented AI inspiration assets: `service-custom-furniture-ai.webp`, `service-custom-sofa-ai.webp`, `service-sofa-repair-ai.webp`, and `service-curtains-blinds-ai.webp`. No other service seed is changed. The gallery is not titled “our work”, and no before/after section is published.
