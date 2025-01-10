import slugify from 'slugify';
import {v4 as uuidv4} from 'uuid';
const slugifyTournament = (name:string) =>{
    const slug = slugify(name, {
        replacement: '-',
        lower: true,
        strict: true,
    });
    const uuid = uuidv4();

    
    const finalSlug = `${slug}-${uuid}`;
    return { finalSlug};

}
export default slugifyTournament;