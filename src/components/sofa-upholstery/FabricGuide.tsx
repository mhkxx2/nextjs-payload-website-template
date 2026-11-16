import { SofaImage } from './SofaImage'
import type { SofaLanding } from './SofaServiceCards'

export function FabricGuide({ cards }: { cards: SofaLanding['fabricCards'] }) {
  return (
    <div className="sofa-card-grid sofa-fabric-grid">
      {cards?.map((card) => (
        <article className="sofa-visual-card" key={card.id || card.title}>
          <SofaImage resource={card.image} />
          <div className="sofa-card-copy">
            <h3>{card.title}</h3>
            <dl>
              <div>
                <dt>Best use</dt>
                <dd>{card.bestUse}</dd>
              </div>
              <div>
                <dt>Comfort</dt>
                <dd>{card.comfort}</dd>
              </div>
              <div>
                <dt>Durability</dt>
                <dd>{card.durability}</dd>
              </div>
            </dl>
          </div>
        </article>
      ))}
    </div>
  )
}
