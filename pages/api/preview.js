import {getPageInfo} from "../../lib/pages";


export default async function handler(req, res) {


    console.log('api preview',req.query.path)
    let path = req.query.path
    console.log("[MyApp.getInitialProps] initial path :", path);

    const qIndex = path.indexOf('?')
    if(qIndex!==-1)
        path = path.substr(0,qIndex)

    const {error, data} = await getPageInfo(path);
    // const {error, data} = await client.query({
    //     query: getPageInfo,
    //     variables: { path: req.query.path.substring(req.query.path.indexOf('ssg/') + 3) }
    // });

    // If the slug doesn't exist prevent preview mode from being enabled
    if (error || !data.jcr.nodeByPath) {
        return res.status(401).json({ message: 'Invalid path' })
    }

    // Enable Preview Mode by setting the cookies
    res.setPreviewData({
        isEdit:req.query.edit === "true" ? true : false
    })

    // Redirect to the path from the fetched post
    // We don't redirect to req.query.slug as that might lead to open redirect vulnerabilities
    //TODO
    res.redirect(data.jcr.nodeByPath.path);
}