# app/services/tech_stack_association_service.py
# Service layer for the Technology Stack Association model.

import pandas as pd
from mlxtend.preprocessing import TransactionEncoder
from mlxtend.frequent_patterns import apriori, association_rules
from app.schemas.tech_stack_association import AssociationTrainingRequest
from app.models.model_manager import save_json_artifact, load_json_artifact
from typing import Dict, Any

class TechStackAssociationService:
    """
    Encapsulates all logic for generating and retrieving technology stack association rules.
    """
    def __init__(self):
        self.model_name = "tech_stack_association"
        self.platforms = ['Web', 'Mobile', 'IoT', 'Desktop'] # Predefined platforms

    def generate_rules(self, training_payload: AssociationTrainingRequest) -> Dict[str, Any]:
        """
        Generates association rules from the provided project data and saves them.
        """
        # 1. Data Transformation
        transactions = []
        for project in training_payload.data:
            transaction = [f"platform:{project.platform_type}"] + [f"lang:{lang}" for lang in project.languages]
            transactions.append(transaction)

        # 2. Transaction Encoding
        te = TransactionEncoder()
        te_ary = te.fit(transactions).transform(transactions)
        df = pd.DataFrame(te_ary, columns=te.columns_)

        # 3. Apriori Algorithm and Association Rules
        frequent_itemsets = apriori(df, min_support=0.02, use_colnames=True)
        rules = association_rules(frequent_itemsets, metric="confidence", min_threshold=0.20)
        strong_rules = rules[rules['lift'] > 1.0].copy()
        strong_rules.sort_values(by=['lift', 'confidence'], ascending=[False, False], inplace=True)

        # 4. Format Output
        output = self._format_rules_for_json(strong_rules)

        # 5. Save Artifact
        artifact_path = save_json_artifact(output, self.model_name)

        return {
            "message": "Association rules generated and saved successfully!",
            "artifact_path": artifact_path
        }

    def get_associations(self) -> Dict[str, Any]:
        """
        Loads and returns the previously generated association rules.
        """
        associations = load_json_artifact(self.model_name)
        if not associations:
            raise RuntimeError(f"Association artifact '{self.model_name}' not found. Please generate the rules first.")
        return {"associations": associations}

    def _format_rules_for_json(self, rules: pd.DataFrame) -> Dict[str, Any]:
        """
        Formats the association rules into a structured dictionary.
        """
        output = {}
        rules['antecedents_str'] = rules['antecedents'].apply(lambda x: ', '.join(sorted(list(x))).replace('lang:', '').replace('platform:', ''))
        rules['consequents_str'] = rules['consequents'].apply(lambda x: ', '.join(sorted(list(x))).replace('lang:', ''))

        for platform in self.platforms:
            platform_identifier = f"platform:{platform}"
            platform_rules = rules[rules['antecedents'].apply(lambda x: platform_identifier in x)].copy()

            platform_output = {"core_stack": [], "popular_combinations": []}

            if not platform_rules.empty:
                core_tech_rules = platform_rules[(platform_rules['antecedents'].apply(len) == 1) & (platform_rules['confidence'] > 0.70)]
                core_techs = []
                if not core_tech_rules.empty:
                    all_core_techs = core_tech_rules['consequents_str'].str.split(', ').explode()
                    core_techs = sorted(list(all_core_techs.unique()))
                    platform_output["core_stack"] = core_techs

                addon_rules = platform_rules[platform_rules['antecedents'].apply(len) > 1].copy()
                if core_techs:
                    addon_rules = addon_rules[~addon_rules['consequents_str'].isin(core_techs)]

                if not addon_rules.empty:
                    for _, row in addon_rules.head(5).iterrows():
                        antecedent_items = sorted([item.replace('lang:', '') for item in row['antecedents'] if 'platform:' not in item])
                        if not antecedent_items: continue
                        platform_output["popular_combinations"].append({
                            "if_using": antecedent_items, "then_add": row['consequents_str'].split(', '),
                            "confidence": round(row['confidence'], 2), "lift": round(row['lift'], 2)
                        })
            output[platform] = platform_output
        return output