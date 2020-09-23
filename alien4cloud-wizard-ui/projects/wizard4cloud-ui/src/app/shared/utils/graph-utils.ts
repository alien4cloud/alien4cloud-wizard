import {graphlib} from "dagre";
import Graph = graphlib.Graph;
import * as _ from "lodash";

export namespace GraphUtils {

  /**
   * Filter the graph eventually excluding nodes.
   */
  export function filterGraph(g: Graph, f: IExcludeNode): Graph {
    _.forEach(g.nodes(), n => {
      let exclude = f.call(this, n);
      if (exclude) {
        _.forEach(g.predecessors(n), p => {
          console.log(`Predecessor ${p}`);
          _.forEach(g.successors(n), s => {
            console.log(`Successor ${s}`);
            g.setEdge(`${p}`, `${s}`);
          });
        });
        g.removeNode(n);
      }
    });
    return g;
  }

  export interface IExcludeNode {
    (nodeId: string): boolean;
  }

}

