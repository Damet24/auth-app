import {AuthService} from "./AuthService.js";
import * as z from "zod";
import {validate} from "../../utils/validate.js";

const service = new AuthService();

export async function login(request, response) {

    const loginSchema = z.object({
        email: z.email(),
        password: z.string().min(8),
        client_id: z.string().min(1)
    });

    const parsed = validate(loginSchema, request.body);

    if (!parsed.success) {
        return response
            .code(400)
            .send({error: "Validation failed", details: parsed.errors.fieldErrors});
    }

    const {email, password, client_id} = request.body;

    const result = await service.login({email, password, clientId: client_id});
    if (!result) return response.code(400).send("jsjsjs");
    return response.send(result);
}


export async function refresh(request, response) {
    const refreshSchema = z.object({refresh_token: z.string().min(1)});

    const parsed = validate(refreshSchema, request.body);

    if (!parsed.success) {
        return response
            .code(400)
            .send({error: "Validation failed", details: parsed.errors.fieldErrors});
    }

    const {refresh_token} = request.body;

    const result = await service.refresh(refresh_token);
    if (!result) return response.code(400).send("jsjsjs");
    return response.send(result);
}
