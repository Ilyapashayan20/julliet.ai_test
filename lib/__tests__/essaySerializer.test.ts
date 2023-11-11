import MarkdownRenderer from '@/lib/utils/mark2slate/renderer'

const text = `
# La vida de Simón Bolívar

## Index

1. Introduction
2. Early Life of Simón Bolívar
3. The Role of Bolívar in the Independence Movement
4. Bolívar's Military Campaigns 
5. Bolívar's Political Career
6. Legacy and Death of Simón Bolívar
7. Conclusion

## Introduction

Simón Bolívar, also known as El Libertador, was one of the most influential figures in South American history. He was not only instrumental in the liberation of South America from Spanish colonial rule, but he laid the foundations for the continent's political future. This essay will examine Bolívar's life and legacy, exploring his role in the independence movement, his military campaigns, and his political career.

## Early Life of Simón Bolívar

Bolívar was born into a wealthy and influential family in Caracas, Venezuela, in 1783. His parents died when he was a child, and he was raised by his uncle, who was a prominent figure in the independence movement. Bolívar was educated in Europe and returned to Venezuela in 1803. 

## The Role of Bolívar in the Independence Movement

Bolívar became involved in the independence movement in 1810, following the deposition of the Spanish king. He was a key figure in the liberation of Venezuela, Colombia, Ecuador, Peru, and Bolivia. His military tactics were known for their surprise attacks and quick thinking.

## Bolívar's Military Campaigns 

Bolívar's military campaigns were crucial to the success of the independence movement. He led several key battles, including the Battle of Boyacá in 1819, which led to the independence of Colombia, and the Battle of Junín in 1824, which secured the independence of Peru. 

## Bolívar's Political Career

Following the liberation of South America, Bolívar became involved in the politics of the new nations. He believed that a strong central government was necessary to prevent the fragmentation of the continent. He served as President of Gran Colombia (now Colombia, Ecuador, Panama, and Venezuela) from 1819 to 1830, and as dictator of Peru from 1824 to 1827. However, his attempts to create a unified continent were met with resistance, and he eventually resigned from his political positions.

## Legacy and Death of Simón Bolívar

Bolívar's vision of a unified, independent South America influenced generations of leaders after him. His legacy lives on in the politics and culture of the continent. Bolívar died in 1830, at the age of 47.

## Conclusion

Simón Bolívar's life was dedicated to the liberation and unification of South America. His military campaigns and political career were ins
`

const Markdown = new MarkdownRenderer()

function reserialized(text: string) {
    return Markdown.serialize(Markdown.deserialize(text))
}

describe('EssaySerializer', () => {
    it('should serialize the essay', () => {
        expect(reserialized(text)).toMatchSnapshot()
    })
})
