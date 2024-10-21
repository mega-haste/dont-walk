import { Vector3 } from "@minecraft/server";

export class Vec3 implements Vector3 {
    constructor(public x: number, public y: number, public z: number) {}
    
    public static fromVector3(v3: Vector3): Vec3 {
        return new Vec3(v3.x, v3.y, v3.z);
    }
    
    public above(steps: number = 1): Vec3 {
        return new Vec3(this.x, this.y + steps, this.z);
    }
    
    public below(steps: number = 1): Vec3 {
        return new Vec3(this.x, this.y - steps, this.z);
    }
    
    public east(steps: number = 1): Vec3 {
        return new Vec3(this.x + steps, this.y, this.z);
    }
    
    public west(steps: number = 1): Vec3 {
        return new Vec3(this.x - steps, this.y, this.z);
    }
    
    public south(steps: number = 1): Vec3 {
        return new Vec3(this.x, this.y, this.z + 1);
    }
    
    public north(steps: number = 1): Vec3 {
        return new Vec3(this.x, this.y, this.z - 1);
    }
}