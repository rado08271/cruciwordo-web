import {
    type RouteConfig,
    index,
    route,

    layout
} from "@react-router/dev/routes";

export default [
    layout('routes/layout.tsx', [
        index("routes/home.tsx"),
        route('create', "routes/create.tsx"),
    ])
] satisfies RouteConfig;
