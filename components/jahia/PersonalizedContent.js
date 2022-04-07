import React from 'react';
import {JahiaCtx} from "../../lib/context";
import {gql, useQuery} from "@apollo/client";
import components from "../index";
import * as PropTypes from "prop-types";

export function PersonalizedContent({id, mainResourcePath}) {
    const {workspace, locale, isEditMode} = React.useContext(JahiaCtx);

    const getContent = gql`query($workspace: Workspace!, $id: String!){
        jcr(workspace: $workspace) {
            workspace
            nodeById(uuid: $id) {
                workspace
                uuid
                name
                property(name: "wem:controlVariant") {
                    value
                }
                children {
                    nodes {
                        workspace
                        uuid
                        path
                        name
                        primaryNodeType {
                            name
                        }
                    }
                }
            }
        }
    }`;

    const {data, loading, error} = useQuery(getContent, {
        variables: {
            workspace,
            id
        }
    });

    return isEditMode ? (
        <div>
            Personalized content - edition

            {data && data.jcr.nodeById.children.nodes.map(node => {

                if (components[node.primaryNodeType.name]) {
                    const Component = components[node.primaryNodeType.name];

                    return (
                        <Component
                            id={node.uuid}
                            path={node.path}
                            mainResourcePath={mainResourcePath}
                        />
                    );
                }
                return "no render"
            })}
        </div>
    ) : (
        <div>
            Personalized content - live

            {data && data.jcr.nodeById.children.nodes.map(node => {

                if (components[node.primaryNodeType.name]) {
                    const Component = components[node.primaryNodeType.name];

                    return (
                        <div style={{display:"none"}}>
                            <Component
                                id={node.uuid}
                                path={node.path}
                                mainResourcePath={mainResourcePath}
                            />
                        </div>
                    );
                }
                return "no render"
            })}
        </div>

    );
}

PersonalizedContent.propTypes = {
    id: PropTypes.string.isRequired,
    mainResourcePath: PropTypes.string.isRequired
};