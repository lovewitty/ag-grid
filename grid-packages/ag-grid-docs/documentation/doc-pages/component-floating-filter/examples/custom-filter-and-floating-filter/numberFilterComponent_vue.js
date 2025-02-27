import Vue from "vue";

export default Vue.extend({
    template: `
        <div style="padding: 4px">
            <div style="font-weight: bold;">Greater than: </div>
            <div>
                <input style="margin: 4px 0 4px 0;" type="number" v-model="filterText" placeholder="Number of medals..."/>
            </div>
        </div>
    `,
    data: function () {
        return {
            filterText: null
        };
    },
    watch: {
        filterText: function(newFilterText, oldFilterText) {
            this.params.filterChangedCallback();
        }
    },
    methods: {
        isFilterActive() {
            return this.filterText !== null &&
                this.filterText !== undefined &&
                this.filterText !== '' &&
                this.isNumeric(this.filterText);
        },

        doesFilterPass(params) {
            const value = this.params.valueGetter(params);

            if (this.isFilterActive()) {
                if (!value) return false;
                return Number(value) > Number(this.filterText);
            }
        },


        isNumeric(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        },

        getModel() {
            return this.isFilterActive() ? Number(this.filterText) : null;
        },

        setModel(model) {
            this.filterText = model;
        },

        myMethodForTakingValueFromFloatingFilter(value) {
            this.filterText = value;
        }
    }
});
