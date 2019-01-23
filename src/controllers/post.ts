import {Request, Response} from "express";
import {getManager} from "typeorm";
import {Post} from "../entity/Post";

export async function post(request: Request, response: Response) {
    const postRepository = getManager().getRepository(Post);

    const newPost = postRepository.create(request.body);

    await postRepository.save(newPost);

    response.send(newPost);
}

export async function getAll(request: Request, response: Response) {
    const postRepository = getManager().getRepository(Post);
    const posts = await postRepository.find({ relations: ["categories"] });

    response.send(posts);
}

export async function getOne(request: Request, response: Response) {
    const postRepository = getManager().getRepository(Post);
    const post = await postRepository.findOne(request.params.id, { relations: ["categories"] });

    // if post was not found return 404 to the client
    if (!post) {
        response.status(404);
        response.end();
        return;
    }
    response.send(post);
}

export async function put(request: Request, response: Response) {
    const postRepository = getManager().getRepository(Post);
    const post = await postRepository.findOne(request.params.id);

    // if post was not found return 404 to the client
    if (!post) {
        response.status(404);
        response.end();
        return;
    }

    post.title = request.body.title || post.title;
    post.text = request.body.text || post.text;
    post.categories = request.body.categories || post.categories;

    await postRepository.save(post);

    response.send(post);
}

export async function remove(request: Request, response: Response) {
    const postRepository = getManager().getRepository(Post);
    const post = await postRepository.findOne(request.params.id);

    // if post was not found return 404 to the client
    if (!post) {
        response.status(404);
        response.end();
        return;
    }

    await postRepository.remove(post);

    response.send(post);
}