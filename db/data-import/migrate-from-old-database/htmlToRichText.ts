import * as cheerio from 'cheerio';
import { Types } from 'mongoose';
import { 
  OrthographePlusRichText, 
  OrthographePlusRichTextBlock, 
  Span, 
  MarkDef 
} from '../../../shared/types/OrthographePlusRichText/OrthographePlusRichText';

export function htmlToRichText(html: string): OrthographePlusRichText {
  if (!html || typeof html !== 'string') return [];

  // Cheerio parse le HTML de manière laxiste (tolère les erreurs)
  const $ = cheerio.load(html, null, false);
  const blocks: OrthographePlusRichText = [];
  
  // Dans Quill, le texte est généralement enveloppé dans des balises blocs comme <p>.
  // Nous itérons sur les nœuds racines.
  const rootNodes = $.root().contents();
  
  rootNodes.each((_, node) => {
    if (node.type === 'text') {
       // Ignorer les nœuds textes vides ou composés uniquement d'espaces entre les balises
       if (node.data.trim() === '') return;
       const block = createBlockFromNodes([node as any], $);
       blocks.push(block);
    } else if (node.type === 'tag') {
       // Gestion spécifique du paragraphe vide Quill: <p><br></p>
       if (node.name === 'p' && $(node).children().length === 1 && $(node).children().first()[0].name === 'br') {
           blocks.push({
               _type: 'block',
               style: 'normal',
               children: [{ _type: 'span', text: '\n' }]
           });
       } else if (node.name === 'br') {
           // Un <br> racine est aussi considéré comme un bloc vide
           blocks.push({ _type: 'block', style: 'normal', children: [] });
       } else {
           // Créer un bloc à partir des enfants de la balise bloc (ex: <p>)
           const block = createBlockFromNodes($(node).contents().toArray() as any[], $);
           blocks.push(block);
       }
    }
  });

  return blocks;
}

function createBlockFromNodes(nodes: any[], $: cheerio.CheerioAPI): OrthographePlusRichTextBlock {
    const children: Span[] = [];
    const markDefs: MarkDef[] = [];
    let colorCounter = 1;

    // Fonction récursive pour parcourir l'arbre DOM
    function processNode(node: any, currentMarks: string[]) {
        if (node.type === 'text') {
            if (node.data) {
                // Quill utilise souvent des espaces insécables ou des sauts de ligne inutiles, 
                // mais on garde les données telles quelles pour ne pas perdre la mise en page fine.
                children.push({
                    _type: 'span',
                    text: node.data,
                    marks: currentMarks.length > 0 ? [...currentMarks] : undefined
                });
            }
        } else if (node.type === 'tag') {
            if (node.name === 'br') {
                // Un <br> au milieu d'un texte est traduit par un saut de ligne natif
                children.push({
                    _type: 'span',
                    text: '\n',
                    marks: currentMarks.length > 0 ? [...currentMarks] : undefined
                });
                return;
            }

            const newMarks = [...currentMarks];
            
            // Gestion du gras
            if (node.name === 'strong' || node.name === 'b') {
                if (!newMarks.includes('strong')) newMarks.push('strong');
            } 
            // Gestion de l'italique
            else if (node.name === 'em' || node.name === 'i') {
                if (!newMarks.includes('em')) newMarks.push('em');
            } 
            // Gestion du souligné
            else if (node.name === 'u') {
                if (!newMarks.includes('underline')) newMarks.push('underline');
            } 
            // Gestion de la couleur via les spans (ex: <span style="color: rgb(230, 0, 0);">)
            else if (node.name === 'span') {
                const style = $(node).attr('style');
                if (style) {
                    // Regex stricte : recherche 'color:' qui n'est PAS précédé par 'background-'
                    // N'accepte que le format rgb(...) ou hex (#fff)
                    const colorMatch = style.match(/(?<!background-)color:\s*(rgb\([^)]+\)|#[0-9a-fA-F]{3,8})/i);
                    
                    if (colorMatch && colorMatch[1]) {
                        const colorValue = colorMatch[1].trim();
            
                        // On s'assure qu'on n'ajoute pas une couleur transparente ou nulle
                        if (colorValue !== 'transparent') {
                            // Création d'une clé unique pour le MarkDef
                            const key = `color-${new Types.ObjectId().toString()}`;
                            
                            markDefs.push({
                                _key: key,
                                _type: 'textColor',
                                value: colorValue
                            });
                            newMarks.push(key);
                        }
                    }
                }
            }

            // Note: On ignore volontairement <strike>, background-color, et ql-align-* 
            // en ne faisant rien de spécifique pour eux. Leur contenu texte sera 
            // capturé normalement via l'appel récursif ci-dessous sans marques supplémentaires.

            // Parcours des enfants
            $(node).contents().each((_, childNode) => {
                processNode(childNode as any, newMarks);
            });
        }
    }

    nodes.forEach(node => processNode(node, []));

    // 1. Filtrer les spans vides
    const cleanedChildren = children.filter(c => c.text !== '');

    // 2. Optimisation : Fusionner les spans adjacents ayant exactement les mêmes marques
    const optimizedChildren: Span[] = [];
    for (const child of cleanedChildren) {
        const last = optimizedChildren[optimizedChildren.length - 1];
        if (last && JSON.stringify(last.marks) === JSON.stringify(child.marks)) {
            last.text += child.text;
        } else {
            optimizedChildren.push({ ...child });
        }
    }

    const block: OrthographePlusRichTextBlock = {
        _type: 'block',
        style: 'normal',
        children: optimizedChildren
    };

    if (markDefs.length > 0) {
        block.markDefs = markDefs;
    }

    return block;
}
